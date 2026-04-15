
"use client"
import ProductDisplay from "@/components/ProductDisplay";

import Footer from "@/components/Footer";
import { useAllProducts, useCategories } from "@/hooks/useDashboard";
export default function Categories(){

    const { data: productData, isLoading: productLoading } = useAllProducts();
    
    if (productLoading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        );
    }
    return(
        <div className="max-w-[2050px]">
               {productData?.data?.products?.length > 0 ? (
              <ProductDisplay
                title="Best Sellers"
                subtitle="Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
                products={productData.data.products}
              />
            ) : (
              <p className="text-center text-gray-500 mt-10">Product not found</p>
            )}
        </div>
    );
}