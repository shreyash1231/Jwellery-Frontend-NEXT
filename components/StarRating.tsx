// Five stars filled to the rating (4.6 fills four and most of the fifth)

const STAR_PATH =
  "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z";

function StarRow({ color, size, gap }: { color: string; size: number; gap: number }) {
  return (
    <span className="flex shrink-0" style={{ gap }} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} className="shrink-0" fill={color}>
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
}

export function Stars({
  value,
  size = 14,
  className = "",
  color = "#e0a526",
  emptyColor = "#e5ded0",
}: {
  value: number;
  size?: number;
  className?: string;
  color?: string;
  emptyColor?: string;
}) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const gap = Math.max(1, Math.round(size / 8));
  // Width of the gold layer, counting the gaps between stars so partial stars line up
  const full = Math.floor(v);
  const width = full * (size + gap) + (v - full) * size;
  return (
    <span
      className={`relative inline-flex align-middle ${className}`}
      role="img"
      aria-label={`Rated ${v.toFixed(1)} out of 5`}
    >
      <StarRow color={emptyColor} size={size} gap={gap} />
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width }}>
        <StarRow color={color} size={size} gap={gap} />
      </span>
    </span>
  );
}

// Compact line for product cards: ★★★★☆ 4.6 (38). Nothing when there are no reviews.
export default function RatingLine({
  average,
  count,
  size = 14,
  className = "",
}: {
  average?: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  if (!count) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm leading-none ${className}`}>
      <Stars value={average || 0} size={size} />
      <span className="font-semibold text-[#2b2118]">{Number(average || 0).toFixed(1)}</span>
      <span className="text-gray-500">({count.toLocaleString("en-IN")})</span>
    </span>
  );
}
