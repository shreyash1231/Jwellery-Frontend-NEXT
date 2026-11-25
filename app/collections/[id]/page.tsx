import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CollectionDetail from "@/components/CollectionDetail";
import { Prefetched } from "@/lib/prefetch";
import { fetchCollection } from "@/service/dashboardService";
import {
  breadcrumbSchema,
  buildMetadata,
  collectionPath,
  getCollection,
  getSiteUrl,
  imageUrl,
  jsonLd,
  productPath,
  toKeywords,
} from "@/lib/seo";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await getCollection(id);
  if (res.status !== "ok") return {};
  const c = res.data;
  const count = c.totalProducts || 0;
  return buildMetadata({
    absoluteTitle: c.metaTitle?.trim() || undefined,
    title: c.metaTitle?.trim() ? undefined : c.title,
    description:
      c.metaDescription ||
      c.description ||
      `${c.title}: ${count} handpicked piece${count === 1 ? "" : "s"} from Kuchalag India. Shop the curated collection online.`,
    keywords: toKeywords(c.metaKeywords, c.title),
    path: collectionPath(c),
    images: (c.products || []).slice(0, 3).map((p) => imageUrl(p.imageUrl?.[0])),
  });
}

export default async function CollectionPage({ params }: Props) {
  const { id } = await params;
  const res = await getCollection(id);

  if (res.status === "missing") notFound();
  // Backend unreachable from the server: let the browser load it as before
  if (res.status === "error") return <CollectionDetail id={id} />;

  const c = res.data;
  // Old links (/collections/<id> or a previous slug) move to the current readable URL
  if (c.slug && decodeURIComponent(id) !== c.slug) {
    permanentRedirect(collectionPath(c));
  }

  const siteUrl = await getSiteUrl();
  // The products in this collection, in order, for Google
  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.title,
    url: `${siteUrl}${collectionPath(c)}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: c.totalProducts,
      itemListElement: (c.products || []).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}${productPath(p)}`,
        name: p.name,
      })),
    },
  };
  const breadcrumbs = await breadcrumbSchema([{ name: c.title, path: collectionPath(c) }]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }} />
      <Prefetched queries={[{ queryKey: ["collection", id], queryFn: () => fetchCollection(id) }]}>
        <CollectionDetail id={id} />
      </Prefetched>
    </>
  );
}
