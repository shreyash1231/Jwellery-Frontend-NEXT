import { pageMetadata } from "@/lib/seo";

// Title/description from Admin > SEO Settings > Pages
export function generateMetadata() {
  return pageMetadata("contactUs", "/contactUs", "Contact Us", "Get in touch with Kuchalag India for orders, custom pieces and questions.");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
