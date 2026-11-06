"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { caramel } from "@/app/fonts";
import Loader from "@/components/Loader";
import CollectionProductCard from "@/components/CollectionProductCard";
import { useCollection } from "@/hooks/useDashboard";
import type { CollectionProduct } from "@/service/dashboardService";

const categoryOf = (p: CollectionProduct) =>
  typeof p.categoryId === "object" ? p.categoryId?._id : p.categoryId;

type Sort = "featured" | "low" | "high";

// Every product of one collection ("View All" from the homepage), in the admin's order
export default function CollectionPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: collection, isLoading, isError } = useCollection(id);

  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const products = useMemo(() => {
    let list = collection?.products || [];
    if (category !== "all") {
      list = list.filter((p) => String(categoryOf(p)) === category);
    }
    if (sort !== "featured") {
      list = [...list].sort((a, b) =>
        sort === "low" ? a.sellingPrice - b.sellingPrice : b.sellingPrice - a.sellingPrice
      );
    }
    return list;
  }, [collection, category, sort]);

  if (isLoading) return <Loader />;

  if (isError || !collection) {
    return (
      <div className="arial-font py-20 text-center">
        <img src="/Images/item-not-found.webp" alt="" className="mx-auto mb-5 w-[220px] opacity-80" />
        <h3 className="mb-2 text-xl">Collection not found</h3>
        <p className="mb-6 text-gray-500">This collection is no longer available.</p>
        <Link href="/" className="rounded-full border border-[#b32126] px-6 py-2.5 text-[#b32126] hover:bg-[#b32126] hover:text-white">
          Back to Home
        </Link>
      </div>
    );
  }

  const chips = [{ _id: "all", name: "All" }, ...(collection.categories || [])];

  return (
    <div className="arial-font">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#fdf3e3] to-white px-4 pb-8 pt-8 md:pb-12 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-4 text-sm text-[#777]">
            <Link href="/" className="hover:text-[#b32126]">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-[#b32126]">{collection.title}</span>
          </nav>
          <div className="flex flex-col items-center text-center">
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a8862a] md:text-xs">
              Curated Collection
            </span>
            <h1 className={`${caramel.className} text-[42px] leading-tight text-[#b32126] md:text-[72px]`}>
              {collection.title}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-[#c9a227]">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a227] md:w-20" />
              <span aria-hidden>✦</span>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a227] md:w-20" />
            </div>
            <p className="mt-3 text-[15px] text-[#555] md:text-lg">
              {collection.totalProducts} handpicked piece{collection.totalProducts === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16">
        {/* Filters */}
        {/* One toolbar: chips wrap on small screens, Sort stays on the right; everything is h-9 */}
        <div className="mb-8 mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-white/90 p-3 shadow-sm ring-1 ring-[#eadfca] backdrop-blur md:mt-8 md:px-4">
          {chips.length > 2 && (
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setCategory(c._id)}
                  className={`inline-flex h-9 items-center rounded-full border px-4 text-sm leading-none transition-colors ${
                    category === c._id
                      ? "border-[#b32126] bg-[#b32126] text-white"
                      : "border-[#e4d6bd] bg-white text-[#5a4a35] hover:border-[#b32126] hover:text-[#b32126]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <label className="ml-auto flex h-9 shrink-0 items-center gap-2 text-sm text-[#555]">
            <span className="whitespace-nowrap">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-9 cursor-pointer rounded-full border border-[#e4d6bd] bg-white px-3 text-sm text-[#2b2118] focus:border-[#b32126] focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </label>
        </div>

        {/* Products */}
        {products.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((p, i) => (
              <div key={p._id} className="collection-rise" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                <CollectionProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-gray-500">No products in this category right now.</p>
        )}
      </div>
    </div>
  );
}
