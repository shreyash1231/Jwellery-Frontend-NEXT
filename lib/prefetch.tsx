// Server-side data for client components, so the page's text, headings, product cards and
// links are in the first HTML Google downloads (not filled in later by the browser).
// The queries use the same keys and fetchers as hooks/useDashboard, so the browser reuses
// this data instead of fetching it again.
import { HydrationBoundary, QueryClient, dehydrate, type QueryKey } from "@tanstack/react-query";
import type { ReactNode } from "react";

export type ServerQuery = { queryKey: QueryKey; queryFn: () => Promise<unknown> };

export async function Prefetched({ queries, children }: { queries: ServerQuery[]; children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  // A failed query is simply left out; the browser fetches it as before
  await Promise.all(queries.map((q) => client.prefetchQuery(q)));
  return <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>;
}
