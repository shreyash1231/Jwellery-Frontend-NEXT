import AllProducts from "@/components/AllProducts";
import { Prefetched } from "@/lib/prefetch";
import { fetchAllProducts, fetchSiteSettings } from "@/service/dashboardService";

// Products are loaded on the server so they are in the first HTML Google downloads
export default function CategoriesPage() {
  return (
    <>
      <h1 className="sr-only">All Categories</h1>
      <Prefetched
        queries={[
          { queryKey: ["all-products"], queryFn: fetchAllProducts },
          { queryKey: ["site-settings"], queryFn: fetchSiteSettings },
        ]}
      >
        <AllProducts />
      </Prefetched>
    </>
  );
}
