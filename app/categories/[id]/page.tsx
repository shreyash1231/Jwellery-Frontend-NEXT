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
      <ProductDisplay
        title={products[0].categoryId.name}
        subtitle="Explore beautiful handcrafted jewellery"
        products={products}
      />
      <Category/>
      <Footer/>
    </div>
  );
}