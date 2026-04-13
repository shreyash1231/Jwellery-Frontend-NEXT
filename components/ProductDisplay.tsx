"use client";

import { useState } from "react";
import { ProductDisplayProps } from "@/type/api";
import { ProductCard } from "./ProductCard";

export default function ProductDisplay({
  title,
  subtitle,
  products,
}: ProductDisplayProps) {

  const ITEMS_PER_PAGE = 8;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="mx-auto p-6 max-w-[2050px]">
      
      {/* HEADER */}
      <div className="mb-6 flex flex-col">
        <span className="text-center text-4xl italic">{title}</span>
        <span className="text-center text-2xl italic">{subtitle}</span>
      </div>

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-fit mx-auto">
        {currentProducts.map((item) => (
          <ProductCard
            key={item._id}
            title={item.name}
            price={`Rs ${item.sellingPrice}/-`}
            image={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.imageUrl[0]}`}
          />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-3 mt-8 flex-wrap">

        {/* Previous Button */}
        <button
          onClick={goToPrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}