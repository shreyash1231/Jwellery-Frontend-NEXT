"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductDisplay from "@/components/ProductDisplay";
import { useAllCategories, useProductsByCategory } from "@/hooks/useDashboard";
import Category from "@/components/Category";
import Loader from "@/components/Loader";
import { caramel } from "@/app/fonts";
import { getParentId } from "@/lib/utils";

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { data, isLoading } = useProductsByCategory(categoryId);
  const { categories, isLoading: categoriesLoading } = useAllCategories();

  if (isLoading || categoriesLoading) {
    return <Loader/>;
  }

  const products = data?.data?.products || [];
  const category = categories.find((c: any) => c._id === categoryId);
  const parent = categories.find((c: any) => c._id === getParentId(category));
  const subCategories = categories.filter(
    (c: any) => getParentId(c) === categoryId
  );

  const title = category?.name || products[0]?.categoryId?.name || "";

  return (
    <div className="arial-font">
      {parent && (
        <div className="max-w-[2050px] mx-auto px-6 pt-6 text-[15px] text-[#555]">
          <Link href={`/categories/${parent._id}`} className="hover:text-[#b32126]">
            {parent.name}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-[#b32126]">{title}</span>
        </div>
      )}

      {subCategories.length > 0 && (
        <div className="max-w-8xl mx-auto px-6 py-10">
          <div className="flex flex-col p-4 text-center">
            <span className={`${caramel.className} text-[35px] md:text-[60px] text-[#b32126]`}>
              {title}
            </span>
            {category?.description && (
              <span className="text-[15px] md:text-[20px] text-[#555]">
                {category.description}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 xl:w-[1100px] mx-auto">
            {subCategories.map((item: any) => (
              <Link
                key={item._id}
                href={`/categories/${item._id}`}
                className="block bg-[#fffbea] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="relative w-full aspect-square">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.imageUrl}`}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 275px"
                    className="object-cover"
                  />
                </div>
                <h3 className={`${caramel.className} text-[#b32126] text-[24px] md:text-[32px] text-center py-3 px-2`}>
                  {item.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 ? (
        <ProductDisplay
          title={subCategories.length > 0 ? `All ${title}` : title}
          subtitle="Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
          products={products}
        />
      ) : subCategories.length === 0 && (
         <div className="text-center py-16">
    <img
      src="/Images/item-not-found.webp"
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
