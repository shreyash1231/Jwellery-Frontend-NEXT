// Percentage off MRP, or 0 when the product isn't discounted
export function getDiscountPercent(product: any): number {
  const mrp = Number(product?.mrp) || 0;
  const selling = Number(product?.sellingPrice) || 0;
  if (!mrp || !selling || selling >= mrp) return 0;
  return Math.round(((mrp - selling) / mrp) * 100);
}

export default function DiscountBadge({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  if (percent < 1) return null;

  return (
    <span
      className={`discount-badge inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white ${className}`}
    >
      <span aria-hidden>✦</span>
      {percent}% OFF
    </span>
  );
}
