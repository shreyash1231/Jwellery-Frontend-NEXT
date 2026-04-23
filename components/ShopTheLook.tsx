"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { API } from "@/service/dashboardService";
import { caramel } from "@/app/fonts";
import Link from "next/link";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

interface Look {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl: string;
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function ShopTheLook() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── Fetch from API ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchLooks = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/user/get-all-shoptolook`);
        const data = res.data?.data?.data || [];
        setLooks(data);
      } catch (err) {
        console.error("Failed to fetch shoptolook products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLooks();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setCurrent((index + looks.length) % looks.length);
        setFading(false);
      }, 300);
    },
    [fading, looks.length]
  );

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  const showControls = looks.length > 1;

  const arrowClass =
    "w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-stone-400 transition-all duration-200 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed";

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-8 md:py-12 px-4 lg:min-h-screen flex flex-col items-center justify-center">
        <p className="text-stone-400 tracking-widest text-sm uppercase">Loading...</p>
      </section>
    );
  }

  // ── Empty ───────────────────────────────────────────────────────────────
  if (looks.length === 0) return null;

  const look = looks[current];

  const videoLook = looks[(current + 1) % looks.length];
const imageLook = look;

  return (
    <section className="py-8 md:py-12 px-4 lg:min-h-screen flex flex-col items-center">
      {/* Heading */}
      <h2 className={`text-[50px] ${caramel.className} text-[#b32126] mb-10`}>
        Shop the Look
      </h2>

      {/* Outer row */}
      <div className="flex items-center gap-4 w-full max-w-4xl">

        {/* Prev arrow — md+ */}
        <button
          onClick={prev}
          aria-label="Previous look"
          disabled={!showControls}
          className={`hidden md:flex flex-shrink-0 ${arrowClass}`}
        >
          <ChevronLeft />
        </button>

        {/* Center column */}
        <div className="flex flex-col flex-1 gap-4">

          {/* Images + Video row */}
          <div
            className={`flex gap-3 md:gap-5 items-start transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* ── BIG: VIDEO ─────────────────────────────────────────── */}
            <div className="relative w-[65%] flex-shrink-0 rounded-md overflow-hidden">
              <div className="relative aspect-[3/3] w-full">
                <video
                  key={videoLook.videoUrl}
                  src={`${IMAGE_BASE_URL}/${videoLook.videoUrl}`}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
               <Link href="/categories/69ea0c521740086ad903b8da">
                <button
                  aria-label="Add to cart"
                  className="absolute bottom-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:bg-white transition-colors duration-200 shadow-sm"
                >
                  <CartIcon />
                </button>
               </Link>
            </div>

            {/* ── SMALL: IMAGE ───────────────────────────────────────── */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="relative rounded-md overflow-hidden">
                <div className="relative aspect-[4/4] w-full">
                  <Image
                    key={look.imageUrl} // ✅ re-renders when look changes
                    src={`${IMAGE_BASE_URL}/${look.imageUrl}`}
                    alt={look.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 35vw, 260px"
                  />
                </div>
              </div>

              {/* Title
              <p className="text-xs md:text-sm text-stone-700 font-medium leading-snug">
                {look.title}
              </p>
              {look.description && (
                <p className="text-xs text-stone-400 leading-snug">
                  {look.description}
                </p>
              )} */}
            </div>
          </div>

          {/* Mobile arrows */}
          {showControls && (
            <div className="flex md:hidden items-center justify-center gap-4">
              <button onClick={prev} aria-label="Previous look" className={arrowClass}>
                <ChevronLeft />
              </button>
              <button onClick={next} aria-label="Next look" className={arrowClass}>
                <ChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Next arrow — md+ */}
        <button
          onClick={next}
          aria-label="Next look"
          disabled={!showControls}
          className={`hidden md:flex flex-shrink-0 ${arrowClass}`}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Dot indicators */}
      {showControls && (
        <div className="flex items-center gap-2 mt-5 md:mt-7">
          {looks.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to look ${i + 1}`}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                i === current
                  ? "w-5 bg-stone-800"
                  : "w-[6px] bg-stone-300 hover:bg-stone-400"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}