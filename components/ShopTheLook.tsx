"use client";

import { useState } from "react";

const looks = [
  {
    mainImage: "/Images/Index7.png",
    products: [
      {
        id: 1,
        image: "/Images/Index7.png",
        name: "Tanvi Green Meenakari Polki Jhumka",
        mrp: 10500,
        sellingPrice: 8400,
        badge: "Sale",
      },
      {
        id: 2,
        image: "/Images/Index7.png",
        name: "Kundan Bridal Necklace Set",
        mrp: 15000,
        sellingPrice: 12000,
        badge: "Sale",
      },
    ],
    // hotspots: clickable cart icons on the main image
    hotspots: [
      { top: "58%", left: "52%" },
      { top: "78%", left: "60%" },
    ],
  },
  // add more looks here
];

export default function ShopTheLook() {
  const [currentLook, setCurrentLook] = useState(0);
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  const look = looks[currentLook];

  const prev = () => setCurrentLook((p) => (p - 1 + looks.length) % looks.length);
  const next = () => setCurrentLook((p) => (p + 1) % looks.length);

  return (
    <section className="w-full bg-[#f9f6f0] py-16 px-6">
      {/* Heading */}
      <h2 className="text-center text-xl font-semibold tracking-[0.3em] uppercase text-gray-800 mb-10">
        Shop The Look
      </h2>

      <div className="max-w-6xl mx-auto flex items-center gap-4">

        {/* ← Prev arrow */}
        <button
          onClick={prev}
          className="w-9 h-9 flex-shrink-0 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-white transition"
        >
          ‹
        </button>

        {/* Main layout */}
        <div className="flex flex-col md:flex-row gap-6 flex-1 items-start">

          {/* Main image with hotspots */}
          <div className="relative w-full md:w-[58%] aspect-[3/4] rounded overflow-hidden flex-shrink-0">
            <img
              src={look.mainImage}
              alt="Shop the look"
              className="w-full h-full object-cover"
            />

            {/* Cart hotspot icons */}
            {look.hotspots.map((hs, i) => (
              <button
                key={i}
                onClick={() => setActiveProduct(activeProduct === i ? null : i)}
                style={{ top: hs.top, left: hs.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
              >
                🛍️
              </button>
            ))}
          </div>

          {/* Product cards on the right */}
          <div className="flex flex-col gap-6 w-full md:w-[40%]">
            {look.products.map((product, i) => {
              const discount = Math.round(
                ((product.mrp - product.sellingPrice) / product.mrp) * 100
              );
              return (
                <div
                  key={product.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    activeProduct === i ? "ring-2 ring-gray-400 rounded" : ""
                  }`}
                  onClick={() => setActiveProduct(activeProduct === i ? null : i)}
                >
                  {/* Product image with Sale badge */}
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-52 object-cover rounded"
                    />
                    {product.badge && (
                      <span className="absolute top-2 right-2 bg-gray-700 text-white text-xs px-2 py-0.5">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="mt-3 text-center">
                    <p className="text-xs font-semibold tracking-widest uppercase text-gray-800">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-1 text-sm">
                      <span className="line-through text-gray-400">
                        MRP ₹{product.mrp.toLocaleString("en-IN")}.00
                      </span>
                      <span className="text-gray-700">
                        MRP ₹{product.sellingPrice.toLocaleString("en-IN")}.00
                      </span>
                      <span className="text-red-500 font-semibold">
                        Save {discount}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* → Next arrow */}
        <button
          onClick={next}
          className="w-9 h-9 flex-shrink-0 rounded-full border border-gray-400 flex items-center justify-center text-gray-600 hover:bg-white transition"
        >
          ›
        </button>

      </div>

      {/* Dots */}
      {looks.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {looks.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentLook(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentLook ? "bg-gray-700 w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}