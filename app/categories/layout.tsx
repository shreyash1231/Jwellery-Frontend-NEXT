import { pageMetadata } from "@/lib/seo";

// Title/description from Admin > SEO Settings > Pages
export function generateMetadata() {
  return pageMetadata("categories", "/categories", "All Categories", "Browse every Kuchalag India collection: bridal jewellery, potlis, wedding gifts, hampers and more.");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
