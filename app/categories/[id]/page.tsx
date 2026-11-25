import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CategoryDetail from "@/components/CategoryDetail";
import { Prefetched } from "@/lib/prefetch";
import {
  fetchCategories,
  fetchShopProductFunction,
  fetchSiteSettings,
  getProductsByCategory,
} from "@/service/dashboardService";
import { breadcrumbSchema, buildMetadata, categoryPath, getCategory, imageUrl, jsonLd, toKeywords } from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getCategory(id);
  // Don't inherit the /categories canonical from the parent layout
  if (res.status !== "ok") return { alternates: { canonical: null } };
  const c = res.data;
  return buildMetadata({
    absoluteTitle: c.metaTitle?.trim() || undefined,
    title: c.metaTitle?.trim() ? undefined : c.name,
    description: c.metaDescription || c.description,
    keywords: toKeywords(c.metaKeywords, c.name, c.parentCategory?.name),
    path: categoryPath(c),
    images: [imageUrl(c.imageUrl)],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const res = await getCategory(id);

  if (res.status === "missing") notFound();
  if (res.status === "error") return <CategoryDetail categoryId={id} />;

  const category = res.data;
  // Old links (/categories/<id> or a previous slug) move to the current readable URL
  if (category.slug && decodeURIComponent(id) !== category.slug) {
    permanentRedirect(categoryPath(category));
  }

  const parent = category.parentCategory?.name ? category.parentCategory : null;
  const breadcrumbs = await breadcrumbSchema([
    ...(parent ? [{ name: parent.name as string, path: categoryPath(parent) }] : []),
    { name: category.name, path: categoryPath(category) },
  ]);

  // Products and category lists loaded on the server, so they are in the first HTML
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      <Prefetched
        queries={[
          { queryKey: ["products", category._id], queryFn: () => getProductsByCategory(category._id) },
          { queryKey: ["categories"], queryFn: fetchCategories },
          { queryKey: ["shopbyProductfunction"], queryFn: fetchShopProductFunction },
          { queryKey: ["site-settings"], queryFn: fetchSiteSettings },
        ]}
      >
        <CategoryDetail categoryId={category._id} />
      </Prefetched>
    </>
  );
}
