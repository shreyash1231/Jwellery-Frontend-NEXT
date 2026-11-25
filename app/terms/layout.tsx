import { pageMetadata } from "@/lib/seo";
import { Prefetched } from "@/lib/prefetch";
import { policyQuery } from "@/service/dashboardService";

// Title/description from Admin > SEO Settings > Pages
export function generateMetadata() {
  return pageMetadata("terms", "/terms", "Terms & Conditions", "Terms and conditions for shopping with Kuchalag India.");
}

// The policy text is loaded on the server, so it is in the first HTML Google downloads
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Prefetched queries={[policyQuery("Terms-policy", "TERMS_AND_CONDITIONS")]}>{children}</Prefetched>;
}
