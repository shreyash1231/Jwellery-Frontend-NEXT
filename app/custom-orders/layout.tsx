import { pageMetadata } from "@/lib/seo";

// Title/description from Admin > SEO Settings > Pages
export function generateMetadata() {
  return pageMetadata("customOrders", "/custom-orders", "Custom Orders", "Request a custom handcrafted piece from Kuchalag India, made to your design.");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
