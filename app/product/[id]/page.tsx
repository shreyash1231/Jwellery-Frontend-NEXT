import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { Prefetched } from "@/lib/prefetch";
import { fetchRelatedProducts, fetchSiteSettings } from "@/service/dashboardService";
import {
  breadcrumbSchema,
  buildMetadata,
  categoryPath,
  getProduct,
  getSeoSettings,
  getSiteUrl,
  imageUrl,
  jsonLd,
  productPath,
  summarize,
  type SeoProduct,
  toKeywords,
} from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getProduct(id);
  if (res.status !== "ok") return {};
  const p = res.data;
  return buildMetadata({
    // Admin's meta title as written; otherwise "<product name> | Kuchalag India"
    absoluteTitle: p.metaTitle?.trim() || undefined,
    title: p.metaTitle?.trim() ? undefined : p.name,
    description: p.metaDescription || p.description,
    keywords: toKeywords(p.metaKeywords, p.tags, p.categoryId?.name),
    path: productPath(p),
    images: (p.imageUrl || []).map((src: string) => imageUrl(src)),
  });
}

// Product details for Google (price, stock, rating)
async function productSchema(p: SeoProduct) {
  const siteUrl = await getSiteUrl();
  const { siteName } = await getSeoSettings();
  // sellingPrice already includes any running discount (backend applies offers)
  const price = Number(p.sellingPrice) || undefined;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: summarize(p.metaDescription || p.description, 500),
    image: (p.imageUrl || []).map((src: string) => imageUrl(src)).filter(Boolean),
    sku: String(p._id),
    url: `${siteUrl}${productPath(p)}`,
    brand: { "@type": "Brand", name: siteName },
    category: p.categoryId?.name,
    keywords: (p.tags || []).join(", ") || undefined,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}${productPath(p)}`,
      priceCurrency: "INR",
      price,
      availability:
        p.shipmentType === "order" || Number(p.quantity) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
  if (Number(p.ratingCount) > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(p.ratingAverage).toFixed(1),
      reviewCount: p.ratingCount,
    };
  }
  return schema;
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const res = await getProduct(id);

  if (res.status === "missing") notFound();

  // Backend unreachable from the server: let the browser load it as before
  if (res.status === "error") return <ProductDetail id={id} />;

  const product = res.data;
  // Old links (/product/<id> or a previous slug) move to the current readable URL
  if (product.slug && decodeURIComponent(id) !== product.slug) {
    permanentRedirect(productPath(product));
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(await productSchema(product)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            await breadcrumbSchema([
              ...(product.categoryId?.name ? [{ name: product.categoryId.name, path: categoryPath(product.categoryId) }] : []),
              { name: product.name, path: productPath(product) },
            ]),
          ),
        }}
      />
      <Prefetched
        queries={[
          { queryKey: ["site-settings"], queryFn: fetchSiteSettings },
          { queryKey: ["related-products", product._id], queryFn: () => fetchRelatedProducts(product._id) },
        ]}
      >
        <ProductDetail id={product._id} initial={product} />
      </Prefetched>
    </>
  );
}
