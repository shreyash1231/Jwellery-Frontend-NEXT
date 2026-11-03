"use client";

import { useMarquee, useNewFeatures } from "@/hooks/useDashboard";
import ClassicAnnouncementBar from "./ClassicAnnouncementBar";

export default function AnnouncementBar() {
  return useNewFeatures() ? <MarqueeBar /> : <ClassicAnnouncementBar />;
}

// Text, colors and speed are managed from the admin panel (Top Marquee)
function MarqueeBar() {
  const { data: marquee } = useMarquee();

  const messages = (marquee?.messages || []).filter((m) => m.trim());
  if (!marquee?.isActive || messages.length === 0) return null;

  const { textColor, backgroundColor } = marquee;
  const duration = marquee.speed || 25;

  // One "lap" of all messages, repeated so the track is always wider than the screen
  const lap = [...messages, ...messages, ...messages];

  return (
    <div
      className="marquee-bar arial-font relative w-full h-[36px] overflow-hidden flex items-center"
      style={{ backgroundColor }}
    >
      {/* soft fade at both edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10"
        style={{ background: `linear-gradient(to right, ${backgroundColor}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10"
        style={{ background: `linear-gradient(to left, ${backgroundColor}, transparent)` }}
      />

      <div
        className="marquee-track flex whitespace-nowrap"
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {lap.map((text, i) => (
              <span
                key={i}
                className="flex items-center text-[12px] tracking-[0.08em] font-semibold uppercase"
                style={{ color: textColor }}
              >
                {text}
                <span className="marquee-star px-6">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .marquee-track {
          animation: marquee-loop 25s linear infinite;
        }

        .marquee-bar:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-star {
          display: inline-block;
          animation: marquee-twinkle 1.6s ease-in-out infinite;
        }

        @keyframes marquee-loop {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-twinkle {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track,
          .marquee-star {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
