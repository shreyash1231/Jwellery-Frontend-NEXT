import Image from "next/image";
import { getAboutUsApi } from "@/service/about.service";
import { caramel } from "../fonts";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

// The admin's About Us pictures; empty when the backend can't be reached (the text still shows)
async function getImages() {
  try {
    const result = await getAboutUsApi();
    const list: { type?: string; image?: string }[] = Array.isArray(result?.data) ? result.data : [];
    const pick = (type: string) => list.find((i) => i.type === type)?.image || "";
    return { topImage: pick("top"), bottomImage: pick("bottom"), backgroundImage: pick("background") };
  } catch {
    return { topImage: "", bottomImage: "", backgroundImage: "" };
  }
}

// Rendered on the server, so the heading and text are in the first HTML Google downloads
export const revalidate = 60;

export default async function AboutUsPage() {
  const { topImage, bottomImage, backgroundImage } = await getImages();

  return (
    <div className="min-h-screen pb-20 arial-font">
      <div className="max-w-5xl mx-auto px-4 pt-12 text-center">
        
        <h1 className={`${caramel.className} text-[50px] text-[#b32126]`}>About Us</h1>

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
                  alt="Kuchalag India handcrafted heritage pieces"
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
                  alt="The Kuchalag India story"
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