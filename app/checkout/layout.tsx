import { privateMetadata } from "@/lib/seo";

// Account / checkout screen: kept out of Google
export const metadata = privateMetadata("Checkout");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
