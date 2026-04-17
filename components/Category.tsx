"use client"

import { caramel } from "@/app/fonts";
import { useCategories } from "@/hooks/useDashboard";
import Image from "next/image";

export default function Category() {
  const { data: getdataCategory, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  const categories = getdataCategory?.data || [];

  return (
    <div className="max-w-8xl mx-auto px-6 py-10 items-center">
      <div className="flex flex-col p-4">
        <span className={`${caramel.className} text-center text-[50px] text-[#b32126]`}>Categories</span>
          <span className="text-center text-[20px] text-[#555]">Shop appropriate to your wedding function</span>
      </div>

      <div className="flex flex-col gap-6">
        {categories.map((item: any, index: number) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item._id}
              className="bg-[#fffbea] w-full h-115 mx-auto xl:w-[1100px] md:h-70 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
              {/* IMAGE SIDE */}
            <div className={`relative flex-shrink-0 w-full md:w-[360px] flex xl:items-center xl:justify-center
                    ${isEven ? "md:order-1" : "md:order-2"}`}
                >
                <div
                    className={`relative w-60 h-60 md:w-full md:h-80 overflow-hidden shadow-md
                    ${isEven ? "rounded-tr-[120px] rounded-br-[120px]" : "rounded-tl-[120px] rounded-bl-[120px]"}`}
                >
                    <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.imageUrl}`}
                    alt={item.name}
                    fill
                    className="object-cover"
                    />
                </div>
            </div>

              {/* TEXT SIDE */}
              <div
                className={`flex-1 flex flex-col justify-center px-2 py-4 md:px-8
                  ${isEven ? "md:order-2" : "md:order-1"}`}
              >
                <h2
                  className={`${caramel.className} text-[#b32126] text-[50px] mb-3`}
                >
                  {item.name}
                </h2>
                <p className="text-[#555] leading-relaxed text-[20px]">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}