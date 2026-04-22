  
  
  
  "use client"
  
  import { caramel } from "@/app/fonts";
import { Button } from "./ui/button";
import Link from "next/link";
import { useCategories, useFooter, useNewsletter } from "@/hooks/useDashboard";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
    export default function Footer() {
  const { data, isLoading: footerLoading } = useFooter();
  const { data: getdataCategory, isLoading: categoryLoading } = useCategories();
  const categories = getdataCategory?.data || [];
        const router = useRouter();
        const handleClick = (id: string) => {
          router.push(`/categories/${id}`);
        };

         const [email, setEmail] = useState("");

  const { mutate, isPending } = useNewsletter();


const handleSubmit = () => {
  if (!email) {
    toast.error("Email is required");
    return;
  }

  mutate(
    { email },
    {
      onSuccess: () => {
        toast.success("Subscribed successfully 🎉");
        setEmail("");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Subscription failed"
        );
      },
    }
  );
};
    return (
        <div>
        {/* Section 1 */}
        <div className="bg-[#fffdce] text-center flex flex-col items-center justify-center gap-6 px-4 py-16">
            <h2 className="text-[15px] md:text-[30px] font-medium text-[#555]">
            Handcrafted in <span className={`${caramel.className} text-[#b32126] text-[25px] md:text-[50px]`}>India</span>. Designed to{" "}
            <span className={`${caramel.className} text-[#b32126] text-[25px] md:text-[50px]`}>stand</span> apart.
            </h2>

            <img
            src="/Images/Frame2.png"
            alt="frame"
            className="w-50 md:w-60 h-auto"
            />
        </div>

        {/* Section 2 */}
        <div className="bg-[#c9b09a] flex flex-col items-center gap-6 px-4 py-16 min-h-[360px]">
            <h2 className="text-[15px] md:text-[35px] font-medium text-[#555] text-center">
            Join exclusive access to{" "}
            <span className={`${caramel.className} text-[#b32126] text-[30px] md:text-[43px]`}>offers & more</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="md:w-full px-12 py-3 md:px-4 md:py-3 rounded-xl border border-gray-300 
                          focus:outline-none focus:ring-2 focus:ring-[#b32126] 
                          text-sm sm:text-base bg-white border-black"
              />

              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="sm:w-auto px-12 py-6 rounded-2xl cursor-pointer bg-[#b01616]"
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>

            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-15 lg:gap-25 xl:gap-40 w-full justify-center mt-20">
                <div className="flex flex-col">
                    <span className=" text-[22px] font-bold">Occasion</span>
                   {categoryLoading ? (
                      <span>Loading...</span>
                    ) : (
                      categories.map((item: any) => (
                        <span
                          key={item._id}
                          className="text-[18px] cursor-pointer hover:text-orange-500"
                          onClick={() => handleClick(item._id)}
                        >
                          {item.name}
                        </span>
                      ))
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <span className=" text-[22px] font-bold">Information</span>
                    <span className="text-[18px]"><Link href="/shipping-policy">Shipping Policy</Link></span>
                    <span className="text-[18px]"><Link href="/exchange-policy">Exchange Policy</Link></span>
                    <span className="text-[18px]"><Link href="/privacy-policy">Privacy Policy</Link></span>
                    <span className="text-[18px]"><Link href="/terms">Terms of Use</Link></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[22px] font-bold">Visit Us</span>

                    {footerLoading ? (
                    <span className="text-[18px]">Loading...</span>
                    ) : data ? (
                    <>
                        <span className="text-[18px]">
                        📍 {data.address?.street} <br />
                        {" "}{data.address?.city}, {data.address?.state} -{" "}
                            {data.address?.zipCode}
                        </span>

                        <span className="text-[18px]">
                        📞 {data.phone}
                        </span>

                        <span className="text-[18px]">
                        ✉️ {data.email}
                        </span>
                    </>
                    ) : (
                    <span className="text-[18px]">No data found</span>
                    )}
                </div>
              <div className="flex flex-col gap-3">
  <span className="text-[22px] font-bold">About Us</span>

  {/* Instagram */}
  {data?.socialLinks?.instagram && (
    <a
      href={data.socialLinks.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[18px] flex items-center gap-2 hover:text-[#b32126] transition"
    >
      <i className="fa-brands fa-instagram"></i>
      Instagram
    </a>
  )}

  {/* Facebook */}
  {data?.socialLinks?.facebook && (
    <a
      href={data.socialLinks.facebook}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[18px] flex items-center gap-2 hover:text-[#b32126] transition"
    >
      <i className="fa-brands fa-facebook-f"></i>
      Facebook
    </a>
  )}

  {/* Twitter */}
  {data?.socialLinks?.twitter && (
    <a
      href={data.socialLinks.twitter}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[18px] flex items-center gap-2 hover:text-[#b32126] transition"
    >
      <i className="fa-brands fa-twitter"></i>
      Twitter
    </a>
  )}

  {/* LinkedIn */}
  {data?.socialLinks?.linkedin && (
    <a
      href={data.socialLinks.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[18px] flex items-center gap-2 hover:text-[#b32126] transition"
    >
      <i className="fa-brands fa-linkedin"></i>
      LinkedIn
    </a>
  )}

  {/* Stamp Image */}
  <img
    src="/Images/rubber-stamp1.png"
    className="w-40 h-20 mt-2"
    alt="Stamp"
  />
</div>
            </div>
        </div>
        </div>
    );
    }