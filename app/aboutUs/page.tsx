"use client";

import Image from "next/image";
import { useAboutUs } from "@/hooks/useAboutUs";
import { caramel } from "../fonts";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

export default function AboutUsPage() {
  const { topImage, bottomImage, backgroundImage, loading } = useAboutUs();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-12 text-center">
        
        <span className={`${caramel.className} text-[50px] text-[#b32126]`}> About Us</span>

        <p className="text-[#555] mt-3 text-[20px]">
          A curated rich heritage treasure box for you to dig deep into.
        </p>

        <p className="text-[#555] text-[20px]">
          KUCH ALAG pioneers design-led innovations that simplify and elevate traditional wear.
        </p>
      </div>

      {/* Background Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="relative w-full rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center"
          style={{
            backgroundImage: backgroundImage
              ? `url(${IMAGE_BASE_URL}/${backgroundImage})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0" />

          {/* Images */}
          <div className="relative z-10 flex flex-col md:gap-6 items-center justify-center p-6">
            
            {/* Top Image */}
            {topImage && (
              <div className="w-90 md:w-180 rounded-xl overflow-hidden">
                <Image
                  src={`${IMAGE_BASE_URL}/${topImage}`}
                  alt="Top About Us"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Bottom Image */}
            {bottomImage && (
              <div className="w-90 md:w-180 rounded-xl overflow-hidden">
                <Image
                  src={`${IMAGE_BASE_URL}/${bottomImage}`}
                  alt="Bottom About Us"
                  width={500}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}