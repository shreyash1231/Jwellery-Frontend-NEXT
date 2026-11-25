import { pageMetadata } from "@/lib/seo";

// Title/description from Admin > SEO Settings > Pages
export function generateMetadata() {
  return pageMetadata("aboutUs", "/aboutUs", "About Us", "The story behind Kuchalag India, a curated heritage treasure box of handcrafted pieces.");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
