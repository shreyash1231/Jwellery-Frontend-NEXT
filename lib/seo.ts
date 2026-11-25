// Server-side helpers for <head> tags, robots.txt and the sitemap.
// Values come from Admin > SEO Settings and the product / category edit screens.
import type { Metadata } from "next";
import { cache } from "react";
import { API } from "@/service/dashboardService";

const IMAGE_BASE_URL = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "").replace(/\/+$/, "");
const FALLBACK_SITE_URL = "https://kuchalagindia.com";
// How long (seconds) the website keeps SEO data before asking the backend again
const REVALIDATE = 60;

export type PageSeo = {
  key: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

export type SeoSettings = {
  siteUrl: string;
  siteName: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultMetaKeywords: string;
  defaultShareImage: string;
  pages: PageSeo[];
  robotsTxt: string;
  defaultRobotsTxt: string;
  headerScripts: string;
  footerScripts: string;
};

const DEFAULT_SETTINGS: SeoSettings = {
  siteUrl: "",
  siteName: "Kuchalag India",
  defaultMetaTitle: "Kuchalag India | Handcrafted Wedding Gifts, Potlis & Hampers",
  defaultMetaDescription:
    "Shop handcrafted wedding gifts, bridal potlis, festive hampers and return gifts from Kuchalag India. Made with love, delivered across India.",
  defaultMetaKeywords: "",
  defaultShareImage: "",
  pages: [],
  robotsTxt: "",
  defaultRobotsTxt: "User-agent: *\nAllow: /\n",
  headerScripts: "",
  footerScripts: "",
};

type Lookup<T> = { status: "ok"; data: T } | { status: "missing" } | { status: "error" };

async function getJson<T>(path: string): Promise<Lookup<T>> {
  try {
    const res = await fetch(`${API}/api/v1/user/${path}`, { next: { revalidate: REVALIDATE } });
    if (res.status === 404) return { status: "missing" };
    if (!res.ok) return { status: "error" };
    const json = await res.json();
    if (!json?.data) return { status: "missing" };
    return { status: "ok", data: json.data as T };
  } catch {
    // Backend unreachable: pages still render, with default tags
    return { status: "error" };
  }
}

export const getSeoSettings = cache(async (): Promise<SeoSettings> => {
  const res = await getJson<Partial<SeoSettings>>("get-seo-settings");
  if (res.status !== "ok") return DEFAULT_SETTINGS;
  const merged = { ...DEFAULT_SETTINGS };
  (Object.keys(DEFAULT_SETTINGS) as (keyof SeoSettings)[]).forEach((k) => {
    const v = res.data[k];
    if (v !== undefined && v !== null && v !== "") (merged as Record<string, unknown>)[k] = v;
  });
  return merged;
});

export const getSiteUrl = async () => {
  const { siteUrl } = await getSeoSettings();
  return (siteUrl || process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");
};

type SeoFields = { slug?: string; metaTitle?: string; metaDescription?: string; metaKeywords?: string };

export type SeoProduct = SeoFields & {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string[];
  tags?: string[];
  sellingPrice?: number;
  quantity?: number;
  shipmentType?: string;
  ratingAverage?: number;
  ratingCount?: number;
  categoryId?: { _id: string; name?: string; slug?: string };
};

export type SeoCategory = SeoFields & {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  parentCategory?: { _id: string; name?: string; slug?: string } | null;
};

export const getProduct = cache((key: string) =>
  getJson<SeoProduct>(`get-product-by-id/${encodeURIComponent(key)}`),
);
export const getCategory = cache((key: string) =>
  getJson<SeoCategory>(`get-category/${encodeURIComponent(key)}`),
);
export const getSitemapData = () =>
  getJson<{ products: SitemapItem[]; categories: SitemapItem[]; collections?: SitemapItem[] }>("get-sitemap-data");

export type SeoCollection = SeoFields & {
  _id: string;
  title: string;
  description?: string;
  totalProducts?: number;
  products?: { _id: string; slug?: string; name: string; imageUrl?: string[] }[];
};
export const getCollection = cache((key: string) =>
  getJson<SeoCollection>(`get-collection/${encodeURIComponent(key)}`),
);

export type SitemapItem = { _id: string; slug?: string; updatedAt?: string };

export { productPath, categoryPath, collectionPath } from "@/lib/links";

/* ---------- Text helpers ---------- */
// Plain text, max `max` characters, cut at a word
export const summarize = (text: string | undefined, max = 160) => {
  const plain = String(text || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 60 ? cut.lastIndexOf(" ") : cut.length)}…`;
};

export const toKeywords = (...values: (string | string[] | undefined)[]) => {
  const words = values
    .flatMap((v) => (Array.isArray(v) ? v : String(v || "").split(",")))
    .map((w) => w.trim())
    .filter(Boolean);
  return [...new Set(words)];
};

export const imageUrl = (path?: string) => {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return IMAGE_BASE_URL ? `${IMAGE_BASE_URL}/${path.replace(/^\/+/, "")}` : undefined;
};

/* ---------- Metadata builder ---------- */
type BuildInput = {
  title?: string; // shown as "<title> | <site name>"
  absoluteTitle?: string; // shown exactly as written
  description?: string;
  keywords?: string[];
  path: string; // canonical path, e.g. /product/bridal-potli-bag
  images?: (string | undefined)[];
};

export async function buildMetadata(input: BuildInput): Promise<Metadata> {
  const settings = await getSeoSettings();
  const description = summarize(input.description || settings.defaultMetaDescription, 300);
  const images = [...(input.images || []), imageUrl(settings.defaultShareImage)].filter(Boolean) as string[];
  // Full title built here (not via the layout template, which a nested layout would override)
  const name = input.title?.replace(/[ \t\r\n]+/g, " ").trim();
  const shareTitle = input.absoluteTitle?.trim() || (name ? `${name} | ${settings.siteName}` : settings.defaultMetaTitle);
  const keywords = input.keywords?.length ? input.keywords : toKeywords(settings.defaultMetaKeywords);

  return {
    title: { absolute: shareTitle },
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: input.path },
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title: shareTitle,
      description,
      url: input.path,
      locale: "en_IN",
      images: images.slice(0, 4).map((url) => ({ url })),
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title: shareTitle,
      description,
      images: images.slice(0, 1),
    },
  };
}

// Metadata for a fixed page (About, Terms...) using what the admin set for it
export async function pageMetadata(key: string, path: string, fallbackTitle: string, fallbackDescription?: string) {
  const settings = await getSeoSettings();
  const page = settings.pages.find((p) => p.key === key);
  const custom = page?.metaTitle?.trim();
  return buildMetadata({
    absoluteTitle: custom || undefined,
    title: custom ? undefined : fallbackTitle,
    description: page?.metaDescription || fallbackDescription,
    keywords: toKeywords(page?.metaKeywords),
    path,
  });
}

// For account / checkout screens: never shown in Google
export const privateMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
});

// Google's breadcrumb trail ("Home › Haldi › Chashma jewel") for a page
export async function breadcrumbSchema(trail: { name: string; path: string }[]) {
  const siteUrl = await getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${siteUrl}${t.path === "/" ? "" : t.path}`,
    })),
  };
}

// Safe to put inside <script type="application/ld+json">
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
