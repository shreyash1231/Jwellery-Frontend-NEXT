"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface Look {
  id: number;
  bigImage: string;
  smallImage: string;
  name: string;
  mrp: string;
  salePrice?: string;
  discount?: string;
  onSale: boolean;
}

const looks: Look[] = [
  {
    id: 1,
    bigImage: "/Images/shop-look-image-1.jpeg",
    smallImage: "/Images/shop-look-image-1.jpeg",
    name: "Tanvi Green Meenakari Polki Jhumka",
    mrp: "₹10,500",
    salePrice: "₹8,400",
    discount: "Save 20%",
    onSale: true,
  },
  {
    id: 2,
    bigImage: "/Images/shop-to-look-2.jpeg",
    smallImage: "/Images/shop-to-look-2.jpeg",
    name: "Kundan Maang Tikka with Pearl Drop",
    mrp: "₹7,200",
    salePrice: "₹6,000",
    discount: "Save 17%",
    onSale: true,
  },
];

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
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setCurrent((index + looks.length) % looks.length);
        setFading(false);
      }, 300);
    },
    [fading]
  );

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  const look = looks[current];
  const showControls = looks.length > 1;

  const arrowClass =
    "w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-stone-400 transition-all duration-200 shadow-sm disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <section className="py-8 md:py-12 px-4 lg:min-h-screen flex flex-col items-center">
      {/* Heading */}
      <h2 className="text-center tracking-[0.2em] text-2xl md:text-4xl font-medium text-stone-700 uppercase mb-6 md:mb-10">
        Shop the Look
      </h2>

      {/* Outer row: side arrows on md+, images in center */}
      <div className="flex items-center gap-4 w-full max-w-4xl">

        {/* Prev — side arrow, md+ only */}
        <button
          onClick={prev}
          aria-label="Previous look"
          disabled={!showControls}
          className={`hidden md:flex flex-shrink-0 ${arrowClass}`}
        >
          <ChevronLeft />
        </button>

        {/* Center column: images + mobile arrows */}
        <div className="flex flex-col flex-1 gap-4">

          {/* Images row */}
          <div
            className={`flex gap-3 md:gap-5 items-start transition-opacity duration-300 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Big image */}
            <div className="relative w-[65%] flex-shrink-0 rounded-md overflow-hidden">
              <div className="relative aspect-[3/3] w-full">
                <Image
                  src={look.bigImage}
                  alt={look.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 65vw, (max-width: 900px) 60vw, 520px"
                  priority
                />
              </div>
              <button
                aria-label="Add to cart"
                className="absolute bottom-3 right-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center text-stone-700 hover:bg-white transition-colors duration-200 shadow-sm"
              >
                <CartIcon />
              </button>
            </div>

            {/* Small image */}
            <div className="flex flex-col gap-3 flex-1">
              <div className="relative rounded-md overflow-hidden">
                <div className="relative aspect-[4/4] w-full">
                  <Image
                    src={look.smallImage}
                    alt={look.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 35vw, 260px"
                  />
                </div>
                {look.onSale && (
                  <span className="absolute top-2 right-2 bg-stone-800 text-white text-[9px] md:text-[10px] font-medium px-1.5 md:px-2 py-0.5 tracking-widest uppercase">
                    Sale
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile arrows — below images, hidden on md+ */}
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

        {/* Next — side arrow, md+ only */}
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