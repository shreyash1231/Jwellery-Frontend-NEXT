"use client";

import { useNewFeatures } from "@/hooks/useDashboard";

// New version keeps the marquee pinned with the header; the old one lets it scroll away
// (Header is sticky on its own, so no wrapper at all in that case)
export default function TopBars({ children }: { children: React.ReactNode }) {
  const newFeatures = useNewFeatures();
  return newFeatures ? <div className="sticky top-0 z-50">{children}</div> : <>{children}</>;
}
