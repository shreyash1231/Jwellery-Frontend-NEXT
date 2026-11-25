import HomePage from "@/components/HomePage";
import { Prefetched } from "@/lib/prefetch";
import {
  fetchBanners,
  fetchBestProducts,
  fetchCategories,
  fetchHomeCollections,
  fetchShopProductFunction,
  fetchSiteSettings,
} from "@/service/dashboardService";
import { getSeoSettings, buildMetadata, toKeywords } from "@/lib/seo";

// Home page title/description from Admin > SEO Settings > Pages > Home,
// falling back to the site's default title
export async function generateMetadata() {
  const settings = await getSeoSettings();
  const page = settings.pages.find((p) => p.key === "home");
  return buildMetadata({
    absoluteTitle: page?.metaTitle?.trim() || settings.defaultMetaTitle,
    description: page?.metaDescription || settings.defaultMetaDescription,
    keywords: toKeywords(page?.metaKeywords || settings.defaultMetaKeywords),
    path: "/",
  });
}

// Banners, best sellers, categories and collections are loaded on the server,
// so the home page's products and links are in the first HTML Google downloads
export default async function Page() {
  const settings = await getSeoSettings();
  return (
    <>
      <h1 className="sr-only">{settings.siteName}: handcrafted wedding gifts, potlis &amp; hampers</h1>
      <Prefetched
        queries={[
          { queryKey: ["banners"], queryFn: fetchBanners },
          { queryKey: ["best-products"], queryFn: fetchBestProducts },
          { queryKey: ["categories"], queryFn: fetchCategories },
          { queryKey: ["shopbyProductfunction"], queryFn: fetchShopProductFunction },
          { queryKey: ["home-collections"], queryFn: fetchHomeCollections },
          { queryKey: ["site-settings"], queryFn: fetchSiteSettings },
        ]}
      >
        <HomePage />
      </Prefetched>
    </>
  );
}
