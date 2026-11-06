"use client";

import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { caramel } from "@/app/fonts";
import { useHomeCollections, useNewFeatures } from "@/hooks/useDashboard";
import type { CollectionPlacement, HomeCollection } from "@/service/dashboardService";
import CollectionProductCard from "./CollectionProductCard";

// Homepage shows this many products per collection; the rest are behind "View All"
export const HOME_COLLECTION_LIMIT = 4;

function CollectionBlock({ collection }: { collection: HomeCollection }) {
  const products = collection.products.slice(0, HOME_COLLECTION_LIMIT);
  const href = `/collections/${collection._id}`;

  return (
    <section className="relative isolate px-4 py-10 md:py-14">
      {/* Warm backdrop band behind the cards */}
      <div className="pointer-events-none absolute inset-x-0 top-1/3 bottom-0 -z-10 bg-gradient-to-b from-[#fdf6ea] via-[#fbf1e1] to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-8 flex flex-col items-center text-center md:mb-10">
          <span className="arial-font mb-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#a8862a] md:text-xs">
            Curated Collection
          </span>
          <h2 className={`${caramel.className} text-[38px] leading-tight text-[#b32126] md:text-[60px]`}>
            {collection.title}
          </h2>
          <div className="mt-2 flex items-center gap-3 text-[#c9a227]">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#c9a227] md:w-16" />
            <span aria-hidden>✦</span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#c9a227] md:w-16" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.map((p, i) => (
            <div key={p._id} className="collection-rise" style={{ animationDelay: `${i * 90}ms` }}>
              <CollectionProductCard product={p} />
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="mt-8 flex justify-center md:mt-10">
          <Link
            href={href}
            className="group arial-font inline-flex items-center gap-3 rounded-full border border-[#b32126] bg-white px-7 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-[#b32126] shadow-sm transition-all duration-300 hover:bg-[#b32126] hover:text-white hover:shadow-lg"
          >
            View All
            {collection.totalProducts > products.length && (
              <span className="rounded-full bg-[#b32126]/10 px-2 py-0.5 text-[11px] tracking-normal group-hover:bg-white/20">
                {collection.totalProducts}
              </span>
            )}
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Every live collection the admin placed in this homepage slot, oldest first.
// Part of the new features switch, like the marquee and discount badges.
export default function CollectionSection({ slot }: { slot: CollectionPlacement }) {
  const newFeatures = useNewFeatures();
  const { data } = useHomeCollections();

  if (!newFeatures) return null;
  const here = (data || []).filter((c) => c.placement === slot && c.products.length > 0);
  if (!here.length) return null;

  return (
    <>
      {here.map((c) => (
        <CollectionBlock key={c._id} collection={c} />
      ))}
    </>
  );
}
