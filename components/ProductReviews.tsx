"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiChevronLeft, FiChevronRight, FiX, FiPlay, FiImage, FiMessageSquare } from "react-icons/fi";
import { useProductReviews } from "@/hooks/useDashboard";
import type { ProductReview, ReviewMedia, ReviewSort } from "@/service/dashboardService";
import { Stars } from "./StarRating";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const mediaUrl = (m: ReviewMedia) => `${IMAGE_BASE_URL}/${m.url}`;

const SORTS: { key: ReviewSort; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "verified", label: "Verified purchase" },
  { key: "photos", label: "With photos" },
];

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const LONG_TEXT = 280;

function ReviewCard({ review, onOpenMedia }: { review: ProductReview; onOpenMedia: (i: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.comment.length > LONG_TEXT;
  const text = long && !expanded ? `${review.comment.slice(0, LONG_TEXT).trimEnd()}…` : review.comment;

  return (
    <article className="review-card rounded-2xl border border-[#eadfca] bg-white p-5 shadow-[0_2px_10px_rgba(80,50,20,0.05)]">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#b32126] to-[#7d1418] text-sm font-bold text-white">
          {initials(review.reviewerName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-semibold text-[#2b2118]">{review.reviewerName}</p>
            {review.isVerifiedPurchase && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                <FiCheckCircle size={12} /> Verified purchase
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Stars value={review.rating} size={15} />
            <span className="text-xs text-gray-500">{formatDate(review.reviewedAt)}</span>
          </div>
        </div>
      </div>

      {review.comment && (
        <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-[#4a3f35]">
          {text}
          {long && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 font-semibold text-[#b32126] hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      )}

      {review.media.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.media.map((m, i) => (
            <button
              key={m.url}
              type="button"
              onClick={() => onOpenMedia(i)}
              aria-label={m.type === "video" ? "Play video" : "View photo"}
              className="group relative h-20 w-20 overflow-hidden rounded-xl bg-[#f7f1e6] ring-1 ring-[#eadfca] sm:h-24 sm:w-24"
            >
              {m.type === "video" ? (
                <>
                  <video src={mediaUrl(m)} muted preload="metadata" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#b32126]">
                      <FiPlay size={16} className="ml-0.5" />
                    </span>
                  </span>
                </>
              ) : (
                <img
                  src={mediaUrl(m)}
                  alt={`Photo from ${review.reviewerName}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

function MediaViewer({
  items,
  start,
  onClose,
}: {
  items: ReviewMedia[];
  start: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(start);
  const m = items[index];
  const go = (d: number) => setIndex((i) => (i + d + items.length) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <FiX size={22} />
      </button>
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Previous"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Next"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <FiChevronRight size={24} />
          </button>
        </>
      )}
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-full flex-col items-center">
        {m.type === "video" ? (
          <video key={m.url} src={mediaUrl(m)} controls autoPlay className="max-h-[80vh] max-w-[88vw] rounded-xl" />
        ) : (
          <img key={m.url} src={mediaUrl(m)} alt="" className="max-h-[80vh] max-w-[88vw] rounded-xl object-contain" />
        )}
        {items.length > 1 && (
          <p className="mt-3 text-sm text-white/70">
            {index + 1} / {items.length}
          </p>
        )}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#eadfca] bg-white p-5">
      <div className="flex gap-3">
        <div className="h-11 w-11 rounded-full bg-[#f1e9da]" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-32 rounded bg-[#f1e9da]" />
          <div className="h-3 w-24 rounded bg-[#f1e9da]" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-[#f1e9da]" />
        <div className="h-3 w-4/5 rounded bg-[#f1e9da]" />
      </div>
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [viewer, setViewer] = useState<{ items: ReviewMedia[]; start: number } | null>(null);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useProductReviews(productId, sort);

  const pages = data?.pages || [];
  const summary = pages[0]?.summary;
  const reviews = pages.flatMap((p) => p?.reviews || []);
  const total = summary?.count || 0;

  // Nothing to show before the first review is added
  if (!isLoading && !isError && total === 0) {
    return (
      <section id="reviews" className="mx-auto mt-16 max-w-7xl scroll-mt-24 px-6 arial-font">
        <h2 className="text-2xl font-semibold text-[#2b2118] md:text-3xl">Customer Reviews</h2>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-dashed border-[#e2d3b5] bg-[#fffaf2] px-6 py-8 text-[#6b5d4f]">
          <FiMessageSquare size={22} className="text-[#c9a227]" />
          No reviews for this piece yet.
        </div>
      </section>
    );
  }
  if (isError) return null;

  return (
    <section id="reviews" className="mx-auto mt-16 max-w-7xl scroll-mt-24 px-6 arial-font">
      <h2 className="text-2xl font-semibold text-[#2b2118] md:text-3xl">Customer Reviews</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-gradient-to-br from-[#fffaf2] to-[#f7eddc] p-6 ring-1 ring-[#eadfca] lg:sticky lg:top-24">
          {summary ? (
            <>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold leading-none text-[#2b2118]">{summary.average.toFixed(1)}</span>
                <span className="pb-1 text-sm text-gray-500">out of 5</span>
              </div>
              <Stars value={summary.average} size={22} className="mt-3" />
              <p className="mt-2 text-sm text-[#6b5d4f]">
                Based on {total.toLocaleString("en-IN")} review{total === 1 ? "" : "s"}
              </p>

              <ul className="mt-5 space-y-2">
                {([5, 4, 3, 2, 1] as const).map((star) => {
                  const n = summary.distribution[String(star) as "1"] || 0;
                  const pct = total ? Math.round((n / total) * 100) : 0;
                  return (
                    <li key={star} className="flex items-center gap-2 text-sm">
                      <span className="w-8 shrink-0 font-medium text-[#2b2118]">{star}★</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#eadfca]">
                        <span
                          className="block h-full rounded-full bg-gradient-to-r from-[#e0a526] to-[#c9a227] transition-[width] duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="w-9 shrink-0 text-right text-gray-500">{pct}%</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                {summary.verified > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-semibold text-green-700 ring-1 ring-green-100">
                    <FiCheckCircle size={12} /> {summary.verified} verified
                  </span>
                )}
                {summary.withMedia > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-semibold text-[#7a5c14] ring-1 ring-[#eadfca]">
                    <FiImage size={12} /> {summary.withMedia} with photos
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="h-48 animate-pulse rounded-xl bg-[#f1e9da]" />
          )}
        </aside>

        {/* List */}
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-semibold text-[#6b5d4f]">Sort by</span>
            {SORTS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSort(s.key)}
                aria-pressed={sort === s.key}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  sort === s.key
                    ? "bg-[#b32126] text-white shadow-sm"
                    : "bg-white text-[#4a3f35] ring-1 ring-[#e2d3b5] hover:ring-[#b32126]/50"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {isLoading
              ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
              : reviews.map((r) => (
                  <ReviewCard key={r._id} review={r} onOpenMedia={(i) => setViewer({ items: r.media, start: i })} />
                ))}
            {isFetchingNextPage && [0, 1].map((i) => <SkeletonCard key={`more-${i}`} />)}
          </div>

          {!isLoading && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500">
                Showing {reviews.length} of {total.toLocaleString("en-IN")}
              </p>
              {hasNextPage && (
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="rounded-full border-2 border-[#b32126] px-8 py-2.5 font-semibold text-[#b32126] transition hover:bg-[#b32126] hover:text-white disabled:opacity-60"
                >
                  {isFetchingNextPage ? "Loading..." : "Load more reviews"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {viewer && <MediaViewer items={viewer.items} start={viewer.start} onClose={() => setViewer(null)} />}
    </section>
  );
}
