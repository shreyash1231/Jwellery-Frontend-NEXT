"use client"


import { caramel } from "@/app/fonts";
import { useState, useEffect, useRef } from "react";

const API_URL = "https://render-jwellery-application-1.onrender.com/api/v1/user/get-all-reels";

interface Reel {
  _id: string;
  title: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Reel[];
}

// SVG Icons
const PlayIcon = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle cx="28" cy="28" r="28" fill="rgba(0,0,0,0.45)" />
    <polygon points="22,16 42,28 22,40" fill="white" />
  </svg>
);

const MuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
  </svg>
);

const UnmuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const Reels = () => {
  const [allReels, setAllReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reels");
        return res.json() as Promise<ApiResponse>;
      })
      .then((json) => {
        setAllReels(json?.data || []);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handlePlay = (index: number): void => {
    setActiveIndex(index);
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.muted = isMuted;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const toggleMute = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const newMute = !prev;
      if (activeIndex !== null) {
        const currentVideo = videoRefs.current[activeIndex];
        if (currentVideo) currentVideo.muted = newMute;
      }
      return newMute;
    });
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <div className="w-9 h-9 rounded-full border-4 border-gray-200 border-t-pink-500 animate-spin" />
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  }

  // --- Empty State ---
  if (!allReels.length) {
    return (
      <div className="flex items-center justify-center min-h-48">
        <p className="text-gray-400 text-sm">No reels found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col text-center mb-6">
        <span className="text-[30px] font-medium text-[#555]">
          Our{" "}
          <span className={`${caramel.className} text-[50px] text-[#b32126]`}>Watch Buy</span>
        </span>
        <span className="text-[20px] text-[#555]">Spot what you like and buy!</span>
      </div>

      {/* Reels scroll row */}
      <div className="flex justify-center gap-4 overflow-x-auto px-5 pb-6 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {allReels.map((reel, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={reel._id}
              onClick={() => handlePlay(index)}
              className={[
                "relative flex-none w-[300px] min-[375px]:w-[350px] min-[425px]:w-[400px] md:w-[200px] rounded-[18px] overflow-hidden bg-black cursor-pointer",
                "snap-center transition-all duration-300",
                isActive
                  ? "scale-100 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
                  : "scale-90 shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
              ].join(" ")}
              style={{ aspectRatio: "9/16" }}
            >
              {/* Video */}
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${reel.videoUrl}`}
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover block"
              />

              {/* Bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

              {/* Title */}
              <p className="absolute bottom-3 left-2.5 right-2.5 text-white text-[11px] font-medium leading-snug pointer-events-none line-clamp-2">
                {reel.title}
              </p>

              {/* Play icon — shown when not active */}
              {!isActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <PlayIcon />
                </div>
              )}

              {/* Mute toggle — shown when active */}
              {isActive && (
                <button
                  onClick={toggleMute}
                  title={isMuted ? "Unmute" : "Mute"}
                  className="absolute bottom-12 right-2.5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/55 border-0 cursor-pointer"
                >
                  {isMuted ? <MuteIcon /> : <UnmuteIcon />}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reels;