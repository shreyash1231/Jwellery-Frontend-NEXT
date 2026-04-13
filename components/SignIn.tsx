import Image from "next/image";
import { Card } from "./ui/card";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="md:h-[500px] lg:h-[580px] xl:h-[620px] w-full max-w-5xl bg-[#fdf7e6] overflow-hidden p-0 shadow-xl rounded-3xl">
        
        <div className="flex h-full flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="relative hidden md:block w-1/2 h-full">
            <Image
              src="/Images/signupPage.jpg"
              alt="Sign in"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Form Section */}
          <div className="flex flex-col justify-center gap-5 p-6 md:p-12 not-open:xl:p-8 w-full md:w-1/2">
            
            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl md:text-3xl font-semibold">Sign In</h2>
              <p className="text-sm md:text-base text-gray-500">
                Welcome back! Please login to your account
              </p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

       
           <div className="flex flex-col gap-2">
              <button className="bg-[#17587c9c] hover:bg-[#207daf9c] text-white rounded-lg p-2 mt-2 transition">
              Login
            </button>

            {/* Signup CTA */}
            <button className="bg-[#22c55e] border text-white cursor-pointer rounded-lg p-2 hover:bg-[#0f8e3d] hover:text-white transition">
              <Link href="/signup">New here? Sign up</Link>
            </button>
           </div>

          </div>
        </div>
      </Card>
    </div>
  );
}