"use client";

import ProductDisplay from "@/components/ProductDisplay";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Category from "@/components/Category";
import { useBanners, useBestProducts } from "@/hooks/useDashboard";
import Loader from "@/components/Loader";
import { caramel } from "./fonts";
import PopUp from "@/components/PopUp";
import DulhanBanner from "@/components/DulhanBanner";
import ShopTheLook from "@/components/ShopTheLook";
export default function Home() {
const { data: bannerData, isLoading: bannerLoading, isError: bannerError } = useBanners();
const { data: productData, isLoading: productLoading, isError: productError } = useBestProducts();

const isLoading = bannerLoading || productLoading;
const isError = bannerError || productError;

if (isLoading) {
  return <Loader />;
}

if (isError) {
  return (
    <div className="text-center text-red-500 py-10">
      Something went wrong
    </div>
  );
}
  return (
      <>
    <PopUp />  
    <div className="flex flex-col gap-12">
      {bannerData?.data?.map((banner: any) => (
        <div key={banner.id} className="relative w-full h-[90vh]">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${banner.imageUrl}`}
            alt="banner"
            fill
            className="object-cover"
          />
        </div>
      ))}
     <div className="flex flex-col gap-4 items-center px-4 max-w-[2050px] mx-auto">
<span className="text-[20px] md:text-[30px] font-medium text-center">
    Our <span className="italic"><span className={`${caramel.className} text-[35px] md:text-[50px] text-[#b32126]`}>Signature Collection</span></span>
  </span>

  <div className="flex flex-col text-[15px] md:text-[20px] text-center text-[#555]">
    <span>
      A curated line of handcrafted jewellery innovations, redefining how adornment is worn and experienced.
    </span>
    <span>
      Each piece is conceived with a design-led philosophy, merging aesthetic distinction with thoughtful functionality.
    </span>
  </div>

  {/* Grid Layout */}
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-6xl">
    
    <div className="relative w-full h-[400px]">
      <Image src="/Images/Index.jpg" alt="" fill className="object-cover rounded-2xl" />
    </div>

    <div className="flex flex-col gap-4">
      <div className="relative w-full h-[191px]">
        <Image src="/Images/Index1.jpg" alt="" fill className="object-cover rounded-2xl" />
      </div>
      <div className="relative w-full h-[191px]">
        <Image src="/Images/Index2.jpg" alt="" fill className="object-cover rounded-2xl" />
      </div>
    </div>

    <div className="flex flex-col gap-4">
      <div className="relative w-full h-[191px]">
        <Image src="/Images/Index3.jpg" alt="" fill className="object-cover rounded-2xl" />
      </div>
      <div className="relative w-full h-[191px]">
        <Image src="/Images/Index4.jpg" alt="" fill className="object-cover rounded-2xl" />
      </div>
    </div>

    <div className="relative w-full h-[400px]">
      <Image src="/Images/Index5.jpeg" alt="" fill className="object-cover rounded-2xl" />
    </div>
      <div className="block md:hidden relative w-full h-[191px]">
        <Image src="/Images/Index6.JPG" alt="" fill className="object-cover rounded-2xl" />
      </div>
       <div className="block md:hidden relative w-full h-[191px]">
        <Image src="/Images/Index7.png" alt="" fill className="object-cover rounded-2xl" />
      </div>


    <div className="hidden md:flex flex-col gap-4">
      <div className="relative w-full h-[191px]">
        <Image src="/Images/Index6.JPG" alt="" fill className="object-cover rounded-2xl" />
      </div>
      <div className="relative w-full h-[191px]">
        <Image src="/Images/Index7.png" alt="" fill className="object-cover rounded-2xl" />
      </div>
    </div>

  </div>
</div>
<Category/>
   {productData?.data?.products?.length > 0 ? (
  <ProductDisplay
    title="Best Sellers"
    subtitle="Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
    products={productData.data.products}
  />
) :(
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
    <div className="flex items-center justify-center w-full pb-5">
  <Button className="bg-white border border-red-800 text-red-800 px-6 py-6 rounded-2xl hover:bg-red-800 hover:text-white transition">
  <Link href="/categories">View All Products</Link>
  </Button>
</div>
<ShopTheLook/>
<DulhanBanner/>
    </div>
    </>
  );
}