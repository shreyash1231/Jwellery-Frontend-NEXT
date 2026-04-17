    import { caramel } from "@/app/fonts";
import { Button } from "./ui/button";

    export default function Footer() {
    return (
        <div>
        {/* Section 1 */}
        <div className="bg-[#fffdce] text-center flex flex-col items-center justify-center gap-6 px-4 py-16">
            <h2 className="text-[30px] font-medium text-[#555]">
            Handcrafted in <span className={`${caramel.className} text-[#b32126] text-[50px]`}>India</span>. Designed to{" "}
            <span className={`${caramel.className} text-[#b32126] text-[50px]`}>stand</span> apart.
            </h2>

            <img
            src="/Images/Frame2.png"
            alt="frame"
            className="w-50 md:w-60 h-auto"
            />
        </div>

        {/* Section 2 */}
        <div className="bg-[#c9b09a] flex flex-col items-center gap-6 px-4 py-16 min-h-[360px]">
            <h2 className="text-[35px] font-medium text-[#555] text-center">
            Join exclusive access to{" "}
            <span className={`${caramel.className} text-[#b32126] text-[43px]`}>offers & more</span>
            </h2>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <input
                type="email"
                placeholder="Enter your email"
                className="md:w-full px-12 py-3 md:px-4 md:py-3 rounded-xl border border-gray-300 
                        focus:outline-none focus:ring-2 focus:ring-[#b32126] 
                        text-sm sm:text-base bg-white border-1 border-black"
            />

            <Button className="sm:w-auto px-12 py-6 rounded-2xl cursor-pointer bg-[#b01616]">
                Submit
            </Button>

            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-15 lg:gap-25 xl:gap-40 w-full justify-center">
                <div className="flex flex-col">
                    <span className=" text-[22px] font-bold">Occasion</span>
                    <span className="text-[18px]">Haldi</span>
                    <span className="text-[18px]">Mehendi</span>
                    <span className="text-[18px]">Sangeet/ Cocktail</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className=" text-[22px] font-bold">Information</span>
                    <span className="text-[18px]">Shipping Policy</span>
                    <span className="text-[18px]">Exchange Policy</span>
                    <span className="text-[18px]">Privacy Policy</span>
                    <span className="text-[18px]">Terms of Use</span>
                </div>
                <div className="flex flex-col">
                    <span className=" text-[22px] font-bold">Visit Us</span>
                    <span className="text-[18px]">  <i className="fa-solid fa-location-dot"></i>Bharat sales corporation 2475 <br/>shrinath market, Delhi, Delhi - <br/>110006</span>
                    <span className="text-[18px]">09582284275</span>
                    <span className="text-[18px]">kuchalagteam@gmail.com</span>
                </div>
                <div className="flex flex-col">
                    <span className=" text-[22px] font-bold">About Us</span>
                    <span className="text-[18px]">Instagram</span>
                    <img
                src="/images/rubber stamp 1.png"
                className="w-40 h-20"
                alt="Stamp"
                />
                </div>
            </div>
        </div>
        </div>
    );
    }