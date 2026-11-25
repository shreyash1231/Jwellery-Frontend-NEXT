import type { MetadataRoute } from "next";
import { getSiteUrl, getSitemapData, productPath, categoryPath, collectionPath } from "@/lib/seo";

// Rebuilt at most every 10 minutes, so new products show up without a redeploy
export const revalidate = 600;

const STATIC_PAGES: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/categories", priority: 0.8, changeFrequency: "weekly" },
  { path: "/custom-orders", priority: 0.6, changeFrequency: "monthly" },
  { path: "/aboutUs", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contactUs", priority: 0.5, changeFrequency: "monthly" },
  { path: "/shipping-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/exchange-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

const date = (value?: string) => (value ? new Date(value) : undefined);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();
  const data = await getSitemapData();
  const products = data.status === "ok" ? data.data.products : [];
  const categories = data.status === "ok" ? data.data.categories : [];
  const collections = data.status === "ok" ? data.data.collections || [] : [];

  return [
    ...STATIC_PAGES.map((p) => ({
      url: `${siteUrl}${p.path === "/" ? "" : p.path}`,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    })),
    ...categories.map((c) => ({
      url: `${siteUrl}${categoryPath(c)}`,
      lastModified: date(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...collections.map((c) => ({
      url: `${siteUrl}${collectionPath(c)}`,
      lastModified: date(c.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${siteUrl}${productPath(p)}`,
      lastModified: date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
