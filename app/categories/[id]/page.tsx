"use client";

import { useParams } from "next/navigation";
import ProductDisplay from "@/components/ProductDisplay";
import { useProductsByCategory } from "@/hooks/useDashboard";
import Category from "@/components/Category";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { data, isLoading } = useProductsByCategory(categoryId);

  if (isLoading) {
    return <Loader/>;
  }

  const products = data?.data?.products || [];

  return (
    <div>
       {data?.data?.products?.length > 0 ? (
        <ProductDisplay
          title={products[0].categoryId.name}
          subtitle="Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
          products={products}
        />
      ) : (
         <div className="text-center py-16">
    <img
      src="/images/item-not-found.webp"
      alt="No products"
      className="w-[220px] mx-auto mb-5 opacity-80"
    />
    <h3 className="text-xl mb-2">Product Not Found</h3>
    <p className="text-gray-500">
      No products are available right now.
    </p>
  </div>
      )}
      <Category/>
    </div>
  );
}