"use client";

import { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
import Loader from "@/components/Loader"
import { API } from "@/service/dashboardService";
import { useCategoriesProduct } from "@/hooks/useDashboard";
import ProductDisplay from "@/components/ProductDisplay";
import Footer from "@/components/Footer";
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const [openSection, setOpenSection] = useState<string | null>("");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const res = await fetch(
        `${API}/api/v1/user/get-product-by-id/${id}`
      );
      const data = await res.json();

      setProduct(data.data);
      setSelectedImage(data.data.imageUrl[0]);
    };

    fetchProduct();
  }, [id]);
  

  const categoryId = product?.categoryId?._id;

 const {
    data: categoryProducts,
    isLoading: isCategoryLoading,
    isError,
    } = useCategoriesProduct(categoryId);

if (!product || isCategoryLoading) {
  return <Loader />;
}
const handleBuyNow = () => {
  const checkoutItem = [
    {
      productId: product._id,
      name: product.name,
      price: product.sellingPrice,
      imageUrl: product.imageUrl?.[0],
      quantity: 1,
    },
  ];

  localStorage.setItem("checkoutItems", JSON.stringify(checkoutItem));

  router.push("/checkout");
};

  return (
  <div className="min-h-screen py-10">
    <div className="max-w-7xl mx-auto px-6 mb-6">
  <button
    onClick={() => router.push("/")}
    className="flex items-center gap-2 text-[#555] hover:text-black font-medium text-xl"
  >
    ← Back to Home
  </button>
</div>
    <div
    className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-6 ${
        openSection ? "items-start" : "items-stretch"
    }`}
    >

      {/* LEFT IMAGE CARD */}
      <div>
        <img
          src={`${IMAGE_BASE_URL}/${selectedImage}`}
          className="w-full md:h-[735px] lg:h-[675px] xl:h-[650px] object-cover rounded-xl"
        />

        {/* Thumbnails */}
        <div className="flex gap-3 mt-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {product.imageUrl.map((img: string, i: number) => (
            <img
              key={i}
              src={`${IMAGE_BASE_URL}/${img}`}
              onClick={() => setSelectedImage(img)}
              className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                selectedImage === img ? "border-red-500" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT CONTENT CARD */}
      <div className="flex flex-col gap-5">

        {/* Title */}
        <h1 className="text-3xl font-semibold">
          {product.name} -{" "}
          <span className="text-[#c41e3a]">
            {product.categoryId?.name}
          </span>
        </h1>

        {/* Price */}
        <div className="text-3xl text-[#c41e3a] font-bold">
          Rs {product.sellingPrice}/-
        </div>

        {/* Tax */}
        <p className="text-gray-500 text-sm">
          Tax included. Shipping calculated at checkout
        </p>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">
          {product.description}
        </p>

        {/* Free Shipping */}
        <div className="flex items-center gap-3 p-3">
          <span>🚚</span>
          <div>
            <p className="font-semibold">Free Shipping On Orders</p>
            <p className="text-sm text-gray-500">Rs 999+</p>
          </div>
        </div>

        {/* ACCORDIONS */}
        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection("returns")}
            className="flex justify-between w-full font-semibold text-lg"
          >
            Returns & Help
            <span>{openSection === "returns" ? "▲" : "▼"}</span>
          </button>

          {openSection === "returns" && (
            <p className="text-gray-600 mt-2 whitespace-pre-line">
              {product.benefits}
            </p>
          )}
        </div>
         <div className="border-t pt-4">
          <button
            onClick={() => toggleSection("quantity")}
            className="flex justify-between w-full font-semibold text-lg"
          >
            Quantity
            <span>{openSection === "quantity" ? "▲" : "▼"}</span>
          </button>

          {openSection === "quantity" && (
            <p className="text-gray-600 font-bold mt-2 whitespace-pre-line">
              {product.quantity}
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection("use")}
            className="flex justify-between w-full font-semibold text-lg"
          >
            How to Use
            <span>{openSection === "use" ? "▲" : "▼"}</span>
          </button>

          {openSection === "use" && (
            <p className="text-gray-600 mt-2">
              {product.use}
            </p>
          )}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => toggleSection("info")}
            className="flex justify-between w-full font-semibold text-lg"
          >
            Additional Information
            <span>{openSection === "info" ? "▲" : "▼"}</span>
          </button>

          {openSection === "info" && (
            <p className="text-gray-600 mt-2 whitespace-pre-line">
              {product.additionalInfo}
            </p>
          )}
        </div>

        {/* ADD TO CART */}
        <button     onClick={handleBuyNow} className="mt-6 bg-red-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-red-700 transition shadow">
          Add To Cart
        </button>

      </div>
    </div>
    <ProductDisplay
    title="Related Products"
    subtitle="Explore more pieces from the same category."
    products={categoryProducts.data.products}
    />
  </div>
);}