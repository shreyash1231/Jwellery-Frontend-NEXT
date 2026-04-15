"use client";

import { useParams } from "next/navigation";
import ProductDisplay from "@/components/ProductDisplay";
import { useProductsByCategory } from "@/hooks/useDashboard";
import Category from "@/components/Category";
import Footer from "@/components/Footer";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { data, isLoading } = useProductsByCategory(categoryId);

  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }

  const products = data?.data?.products || [];

  return (
    <div>
       {data?.data?.products?.length > 0 ? (
        <ProductDisplay
          title="Best Sellers"
          subtitle="Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
          products={products}
        />
      ) : (
        <p className="text-center text-gray-500 mt-10">Product not found</p>
      )}
      <Category/>
    </div>
  );
}