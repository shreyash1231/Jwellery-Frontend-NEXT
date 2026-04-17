"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

export default function otp() {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);

  // ✅ Check otptoken
  useEffect(() => {
    const token = localStorage.getItem("otptoken");
    if (!token) {
      toast.error("Unauthorized access");
      router.push("/signup");
    }
  }, []);

  // ✅ Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ OTP input handler
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 4) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }

    // Auto focus previous on backspace
    if (!value && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  // ✅ Submit OTP
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ❌ Block if expired
    if (timeLeft <= 0) {
      toast.error("OTP expired. Please resend OTP");
      return;
    }

    const finalOtp = otp.join("");

    if (finalOtp.length < 5) {
      toast.error("Enter valid OTP");
      return;
    }

    try {
      const token = localStorage.getItem("otptoken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/verify-otp`,
        {
          otp: finalOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "OTP verified");

      // ✅ Redirect after success
      router.push("/signin"); // change if needed
      localStorage.removeItem("otptoken");

    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "OTP verification failed"
      );
    }
  };

  // ✅ Resend OTP
  const handleResend = () => {
    setTimeLeft(120);
    setOtp(["", "", "", "", ""]);
    toast.success("OTP Resent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="md:h-[500px] lg:h-[580px] xl:h-[620px] w-full max-w-5xl bg-[#fdf7e6] overflow-hidden p-0 shadow-xl rounded-3xl">
        <div className="flex h-full flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="relative hidden md:block w-1/2 h-full">
            <Image
              src="/Images/horse-image.JPG"
              alt="Sign in"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center gap-5 p-6 md:p-12 w-full md:w-1/2"
          >
            
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Verify your Number
              </h2>
              <p className="text-sm md:text-base text-gray-500">
                An OTP has been sent to your Email Id
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Enter OTP</label>

              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    disabled={timeLeft <= 0}
                    onChange={(e) =>
                      handleChange(e.target.value, index)
                    }
                    className="w-10 h-10 md:w-12 md:h-12 text-center border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
                  />
                ))}
              </div>
            </div>

            {/* Timer / Resend */}
            <div className="text-sm text-gray-600">
              {timeLeft > 0 ? (
                <p>
                  Resend OTP in{" "}
                  <span className="font-semibold">
                    {Math.floor(timeLeft / 60)}:
                    {String(timeLeft % 60).padStart(2, "0")}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-green-600 font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={timeLeft <= 0}
              className="bg-[#22c55e] text-white rounded-lg p-2 hover:bg-[#0f8e3d] transition disabled:bg-gray-400"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}