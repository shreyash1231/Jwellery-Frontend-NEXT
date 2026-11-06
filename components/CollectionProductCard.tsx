"use client";

import Link from "next/link";
import { FiShoppingBag, FiArrowUpRight } from "react-icons/fi";
import { useAddToCart } from "@/hooks/useDashboard";
import DiscountBadge, { getDiscountPercent } from "./DiscountBadge";
import type { CollectionProduct } from "@/service/dashboardService";

const imageUrl = (path?: string) =>
  path ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${path}` : "/Images/item-not-found.webp";

const rupees = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// Product card for collections: tall photo that swaps to the second photo on hover,
// discount ribbon, and an "Add to Cart" bar that slides up over the photo
export default function CollectionProductCard({ product }: { product: CollectionProduct }) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const images: string[] = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl].filter(Boolean);
  const discount = getDiscountPercent(product);
  const href = `/product/${product._id}`;

  return (
    <article className="collection-card group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#eadfca] shadow-[0_2px_10px_rgba(80,50,20,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(120,60,30,0.18)] hover:ring-[#c9a227]/60">
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f1e6]">
        <Link href={href} className="absolute inset-0 block" aria-label={product.name}>
          <img
            src={imageUrl(images[0])}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
              images[1] ? "group-hover:opacity-0" : ""
            }`}
          />
          {images[1] && (
            <img
              src={imageUrl(images[1])}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          {/* Soft fade at the bottom so the add-to-cart bar reads on any photo */}
          <span className="collection-card__fade pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-500" />
        </Link>

        <DiscountBadge percent={discount} className="absolute left-3 top-3" />

        <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#b32126] opacity-0 shadow-md backdrop-blur transition-all duration-500 group-hover:opacity-100">
          <FiArrowUpRight size={18} />
        </span>

        {/* Quick add: slides up on hover; always shown on touch screens (see globals.css) */}
        <button
          type="button"
          onClick={() => addToCart({ productId: product._id, productData: product })}
          disabled={isPending}
          className="collection-card__add absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-white/95 py-2.5 text-sm font-semibold text-[#b32126] shadow-lg backdrop-blur transition-all duration-500 hover:bg-[#b32126] hover:text-white disabled:opacity-70"
        >
          <FiShoppingBag size={16} />
          {isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {/* Details */}
      <Link href={href} className="flex flex-1 flex-col items-center gap-1.5 px-3 pb-3 pt-4 text-center">
        <h3 className="arial-font line-clamp-2 min-h-[2.6em] text-[15px] font-semibold leading-snug text-[#2b2118] md:text-base">
          {product.name}
        </h3>
        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />
        <div className="arial-font flex flex-wrap items-baseline justify-center gap-x-2">
          <span className="text-lg font-bold text-[#b32126]">{rupees(product.sellingPrice)}</span>
          {discount > 0 && <span className="text-sm text-gray-400 line-through">{rupees(product.mrp ?? 0)}</span>}
        </div>
      </Link>
    </article>
  );
}
