import Image from "next/image";
import { Card } from "./ui/card";
import Link from "next/link";

export default function ContactUsCard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <Card className="md:h-[500px] lg:h-[580px] xl:h-[620px] w-full max-w-5xl bg-[#fdf7e6] overflow-hidden p-0 shadow-xl rounded-3xl">
        
        <div className="flex h-full flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="relative hidden md:block w-1/2 h-full">
            <Image
              src="/Images/horse-image.JPG"
              alt="Sign up"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Form Section */}
          <div className="flex flex-col gap-5 p-6 md:p-8 w-full md:w-1/2 lg:justify-center">
            
            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Contact Us
              </h2>
              <p className="text-sm md:text-base text-gray-500">
                Send us your custom order request/ query/ emergency info or order/ message
              </p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-4">

              {/* ✅ md = 2 columns, lg+ = back to 1 column */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-sm font-medium">Message</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-2">

                <button
                  type="submit"
                  className="bg-[#17587c9c] hover:bg-[#207daf9c] text-white rounded-lg p-2 transition"
                >
                  Submit
                </button>

                <Link
                  href="/signin"
                  className="bg-[#22c55e] text-white text-center rounded-lg p-2 hover:bg-[#0f8e3d] transition"
                >
                  Chat on Whatsapp
                </Link>

              </div>

            </form>

          </div>
        </div>
      </Card>
    </div>
  );
}