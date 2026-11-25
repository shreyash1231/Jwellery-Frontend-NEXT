import { pageMetadata } from "@/lib/seo";
import { Prefetched } from "@/lib/prefetch";
import { policyQuery } from "@/service/dashboardService";

// Title/description from Admin > SEO Settings > Pages
export function generateMetadata() {
  return pageMetadata("privacyPolicy", "/privacy-policy", "Privacy Policy", "How Kuchalag India collects, uses and protects your information.");
}

// The policy text is loaded on the server, so it is in the first HTML Google downloads
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Prefetched queries={[policyQuery("Privacy-policy", "PRIVACY_POLICY")]}>{children}</Prefetched>;
}
