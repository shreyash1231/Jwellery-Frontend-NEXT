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
import { useEffect, useState } from "react";

export default function Home() {
  const {
    data: bannerData,
    isLoading: bannerLoading,
    isError: bannerError,
  } = useBanners();

  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useBestProducts();

  const [currentBanner, setCurrentBanner] = useState(0);

  const isLoading = bannerLoading || productLoading;
  const isError = bannerError || productError;

  const banners = bannerData?.data || [];

  // Automatically change banner every 3 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Previous banner
  const handlePrevious = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  // Next banner
  const handleNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

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

        {/* ================= BANNER CAROUSEL ================= */}
        {banners.length > 0 && (
          <div className="relative w-full h-[90vh] overflow-hidden">

            {/* Horizontal slider */}
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentBanner * 100}%)`,
              }}
            >
              {banners.map((banner: any) => (
                <div
                  key={banner.id}
                  className="relative min-w-full h-full flex-shrink-0"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${banner.imageUrl}`}
                    alt="banner"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Left Arrow */}
            {banners.length > 1 && (
              <button
                onClick={handlePrevious}
                aria-label="Previous banner"
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  z-10
                  w-12
                  h-12
                  rounded-full
                  bg-white/80
                  backdrop-blur-sm
                  shadow-md
                  flex
                  items-center
                  justify-center
                  text-2xl
                  text-gray-800
                  hover:bg-white
                  transition
                "
              >
                &#10094;
              </button>
            )}

            {/* Right Arrow */}
            {banners.length > 1 && (
              <button
                onClick={handleNext}
                aria-label="Next banner"
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  z-10
                  w-12
                  h-12
                  rounded-full
                  bg-white/80
                  backdrop-blur-sm
                  shadow-md
                  flex
                  items-center
                  justify-center
                  text-2xl
                  text-gray-800
                  hover:bg-white
                  transition
                "
              >
                &#10095;
              </button>
            )}

            {/* Dots */}
            {banners.length > 1 && (
              <div
                className="
                  absolute
                  bottom-5
                  left-1/2
                  -translate-x-1/2
                  z-10
                  flex
                  gap-2
                "
              >
                {banners.map((banner: any, index: number) => (
                  <button
                    key={banner.id}
                    onClick={() => setCurrentBanner(index)}
                    aria-label={`Go to banner ${index + 1}`}
                    className={`
                      h-2
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        currentBanner === index
                          ? "w-8 bg-white"
                          : "w-2 bg-white/60"
                      }
                    `}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= SIGNATURE COLLECTION ================= */}

        <div className="flex flex-col gap-4 items-center px-4">
          <span className="text-[20px] md:text-[40px] font-medium text-center">
            Our{" "}
            <span className="italic">
              <span
                className={`${caramel.className} text-[35px] md:text-[60px] text-[#b32126]`}
              >
                Signature Collection
              </span>
            </span>
          </span>

          <div className="arial-font flex flex-col text-[15px] md:text-[20px] text-center text-[#555]">
            <span>
              A curated line of handcrafted jewellery innovations, redefining
              how adornment is worn and experienced.
            </span>

            <span>
              Each piece is conceived with a design-led philosophy, merging
              aesthetic distinction with thoughtful functionality.
            </span>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-7xl">

            <div className="relative w-full h-[450px]">
              <Image
                src="/Images/Index.jpg"
                alt=""
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative w-full h-[217px]">
                <Image
                  src="/Images/Index1.jpg"
                  alt=""
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              <div className="relative w-full h-[217px]">
                <Image
                  src="/Images/Index2.jpg"
                  alt=""
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative w-full h-[217px]">
                <Image
                  src="/Images/Index3.jpg"
                  alt=""
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              <div className="relative w-full h-[217px]">
                <Image
                  src="/Images/Index4.jpg"
                  alt=""
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>

            <div className="relative w-full h-[450px]">
              <Image
                src="/Images/Index5.jpeg"
                alt=""
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            <div className="block md:hidden relative w-full h-[217px]">
              <Image
                src="/Images/IMG_5469.JPG"
                alt=""
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            <div className="block md:hidden relative w-full h-[217px]">
              <Image
                src="/Images/Index7.png"
                alt=""
                fill
                className="object-cover rounded-2xl"
              />
            </div>

            <div className="hidden md:flex flex-col gap-4">
              <div className="relative w-full h-[217px]">
                <Image
                  src="/Images/IMG_5469.JPG"
                  alt=""
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>

              <div className="relative w-full h-[217px]">
                <Image
                  src="/Images/Index7.png"
                  alt=""
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        <Category />

        {productData?.data?.products?.length > 0 ? (
          <ProductDisplay
            title="Best Sellers"
            subtitle="Our most sought-after designs, worn, loved, and remembered."
            products={productData.data.products}
          />
        ) : (
          <div className="text-center py-16 arial-font">
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

        <ShopTheLook />
        <DulhanBanner />

      </div>
    </>
  );
}
