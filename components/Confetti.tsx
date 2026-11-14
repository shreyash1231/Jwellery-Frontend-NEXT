"use client";

import { useEffect, useRef } from "react";

// Jewellery palette: golds, maroon, blush, ivory
const COLORS = [
  "#c9a227", "#e3c77a", "#ffd700", "#b8860b", // golds
  "#b32126", "#d4483f", "#8b1a1f",            // reds
  "#e8b4b8", "#f4c2c2",                      // blush
  "#fffaf0", "#2e8b57",                      // ivory, emerald
];

const DURATION_MS = 4200; // whole show, including the fade-out
const FADE_MS = 900;

type Shape = "paper" | "ribbon" | "circle" | "star";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  back: string; // darker colour shown while the piece is flipped over
  shape: Shape;
  rotation: number;
  spin: number;
  tilt: number; // phase of the 3D flip
  tiltSpeed: number;
  wobble: number; // phase of the side-to-side sway
  wobbleSpeed: number;
  drag: number;
  delay: number; // ms before this piece appears
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const shade = (hex: string, amount: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c * (1 - amount))));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

const makePiece = (
  x: number,
  y: number,
  angleDeg: number,
  speed: number,
  delay: number,
  shapes: Shape[] = ["paper", "paper", "paper", "ribbon", "circle", "star"]
): Piece => {
  const shape = pick(shapes);
  const color = pick(COLORS);
  const a = (angleDeg * Math.PI) / 180;
  const size = rand(7, 12);
  return {
    x,
    y,
    vx: Math.cos(a) * speed,
    vy: Math.sin(a) * speed,
    w: shape === "ribbon" ? size * 0.45 : size,
    h: shape === "ribbon" ? size * 2.4 : shape === "paper" ? size * 0.6 : size,
    color,
    back: shade(color, 0.35),
    shape,
    rotation: rand(0, Math.PI * 2),
    spin: rand(-0.15, 0.15),
    tilt: rand(0, Math.PI * 2),
    tiltSpeed: rand(0.08, 0.2),
    wobble: rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.03, 0.08),
    drag: shape === "circle" ? 0.985 : rand(0.955, 0.975), // paper catches more air
    delay,
  };
};

const drawStar = (ctx: CanvasRenderingContext2D, r: number) => {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 ? r * 0.45 : r;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
  }
  ctx.closePath();
  ctx.fill();
};

/**
 * Full-screen confetti celebration. Re-fires every time `fireKey` changes (0 = idle).
 * `origin` (viewport px) is where the centre burst comes from, e.g. the coupon box;
 * without it the burst starts in the middle of the screen.
 */
export default function Confetti({
  fireKey,
  origin,
}: {
  fireKey: number;
  origin?: { x: number; y: number } | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Latest origin, read when a burst fires (changing origin alone doesn't re-fire)
  const originRef = useRef(origin);
  useEffect(() => {
    originRef.current = origin;
  }, [origin]);

  useEffect(() => {
    if (!fireKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Fewer pieces on small screens keeps phones smooth
    const scale = width < 640 ? 0.55 : 1;
    const n = (count: number) => Math.round(count * scale);
    const pieces: Piece[] = [];

    // 1. Burst out of the coupon box, all directions but mostly up
    const o = originRef.current || { x: width / 2, y: height / 2 };
    for (let i = 0; i < n(110); i++) {
      pieces.push(makePiece(o.x, o.y, rand(-165, -15), rand(9, 19), rand(0, 60)));
    }

    // 2. Side cannons from the bottom corners, slightly after the burst
    for (let i = 0; i < n(80); i++) {
      pieces.push(makePiece(-10, height * 0.85, rand(-75, -50), rand(16, 26), rand(150, 350)));
      pieces.push(makePiece(width + 10, height * 0.85, rand(-130, -105), rand(16, 26), rand(150, 350)));
    }

    // 3. Gentle shower from the top for the finale
    for (let i = 0; i < n(90); i++) {
      pieces.push(
        makePiece(rand(0, width), rand(-60, -10), rand(80, 100), rand(1, 3), rand(450, 1400), [
          "paper",
          "paper",
          "ribbon",
          "star",
        ])
      );
    }

    const start = performance.now();
    let last = start;
    let frame = 0;

    const draw = (now: number) => {
      const elapsed = now - start;
      // Frame-rate independent: 1 = one 60 fps frame
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      ctx.clearRect(0, 0, width, height);
      const fade = elapsed > DURATION_MS - FADE_MS ? Math.max(0, (DURATION_MS - elapsed) / FADE_MS) : 1;

      for (const p of pieces) {
        if (elapsed < p.delay || p.y > height + 40) continue;

        // Air drag, gravity, then a capped fall speed so paper drifts instead of dropping
        const drag = Math.pow(p.drag, dt);
        p.vx *= drag;
        p.vy = p.vy * drag + 0.32 * dt;
        const terminal = p.shape === "circle" ? 7 : 3.6;
        if (p.vy > terminal) p.vy = terminal;

        p.wobble += p.wobbleSpeed * dt;
        p.tilt += p.tiltSpeed * dt;
        p.rotation += p.spin * dt;
        p.x += (p.vx + Math.sin(p.wobble) * 1.2) * dt;
        p.y += p.vy * dt;

        // cos of the tilt squashes the piece to fake a 3D flip; the back face is darker
        const flip = Math.cos(p.tilt);

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = flip > 0 ? p.color : p.back;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.w / 2.4, (p.w / 2.4) * Math.max(Math.abs(flip), 0.3), 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star") {
          ctx.scale(1, Math.max(Math.abs(flip), 0.25));
          drawStar(ctx, p.w / 1.6);
        } else {
          ctx.scale(1, flip || 0.05);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          // a thin highlight makes the gold pieces glint as they turn
          if (flip > 0.7) {
            ctx.fillStyle = "rgba(255,255,255,0.35)";
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.25);
          }
        }
        ctx.restore();
      }

      if (elapsed < DURATION_MS) {
        frame = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [fireKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] h-screen w-screen"
    />
  );
}
