import { pageMetadata } from "@/lib/seo";
import { Prefetched } from "@/lib/prefetch";
import { policyQuery } from "@/service/dashboardService";

// Title/description from Admin > SEO Settings > Pages
export function generateMetadata() {
  return pageMetadata("exchangePolicy", "/exchange-policy", "Exchange Policy", "How exchanges work for Kuchalag India orders.");
}

// The policy text is loaded on the server, so it is in the first HTML Google downloads
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Prefetched queries={[policyQuery("Exchange-policy", "EXCHANGE_POLICY")]}>{children}</Prefetched>;
}
