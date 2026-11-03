"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#b32126", "#c9a227", "#f4e8dc", "#e8b4b8", "#2a2016", "#ffd700", "#d4483f"];
const DURATION_MS = 3200;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
  shape: "rect" | "circle";
};

// Full-screen confetti burst from both bottom corners. Re-fires whenever `fireKey` changes.
export default function Confetti({ fireKey }: { fireKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fireKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pieces: Piece[] = [];
    const cannon = (originX: number, direction: 1 | -1) => {
      for (let i = 0; i < 90; i++) {
        const angle = (Math.PI / 180) * (55 + Math.random() * 30); // 55°–85° upwards
        const speed = 11 + Math.random() * 9;
        pieces.push({
          x: originX,
          y: height,
          vx: Math.cos(angle) * speed * direction,
          vy: -Math.sin(angle) * speed,
          size: 6 + Math.random() * 6,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          shape: Math.random() > 0.3 ? "rect" : "circle",
        });
      }
    };
    cannon(0, 1);
    cannon(width, -1);

    const start = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);
      const fade = Math.max(0, 1 - Math.max(0, elapsed - DURATION_MS * 0.6) / (DURATION_MS * 0.4));

      for (const p of pieces) {
        p.vy += 0.28; // gravity
        p.vx *= 0.99; // drag
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;

        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          ctx.fill();
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
