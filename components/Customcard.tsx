
"use client"


import Image from "next/image";
import { Card } from "./ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from "react";
import { toast } from "sonner";
import { useCustomOrder } from "@/hooks/useCustomOrder";
import { caramel } from "@/app/fonts";

export default function Customcard() {
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");

  const { mutate, isPending } = useCustomOrder();

  const handleSubmit = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // 🔥 CHECK LOGIN
    if (!token) {
      toast.error("Please login first 🔐");
      return;
    }

    if (!type || !date || !address) {
      toast.error("Please fill all fields");
      return;
    }

    const loadingToast = toast.loading("Submitting order...");

    mutate(
      {
        type: type.toUpperCase(),
        date,
        address,
        token, // ✅ PASS TOKEN
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success("Order submitted successfully ✅");

          setType("");
          setDate("");
          setAddress("");
        },
        onError: (error: any) => {
          toast.dismiss(loadingToast);

          toast.error(
            error?.response?.data?.message || "Something went wrong ❌"
          );
        },
      }
    );
  };
  return (
    <div>    <h2 className={`${caramel.className} text-[50px] text-center text-[#b32126]`}>
              Custom Orders
            </h2>
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="md:h-[500px] lg:h-[580px] xl:h-[620px] w-full max-w-5xl bg-[#fdf7e6] overflow-hidden p-0 shadow-xl rounded-3xl">
        
        <div className="flex h-full flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="relative hidden md:block w-1/2 h-full">
            <Image
              src="/Images/horse-image.JPG"
              alt="Sign in"
              fill
              
              className="object-fill"
              priority
            />
          </div>

          {/* Form Section */}
           <div className="flex flex-col gap-5 p-6 md:p-10 w-full md:w-1/2 justify-center">

            {/* Dropdown */}
             <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Type of Order</label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {type || "Select Type"}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-full">
                  <DropdownMenuGroup>
                    {["Bulk", "Bridesmaid", "Best Man", "Single"].map((item) => (
                      <DropdownMenuItem
                        key={item}
                        onClick={() => setType(item)}
                      >
                        {item}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>


            {/* Inputs Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Date of Delivery
                </label>
                <input
                  type="date"
                  value={date || ""}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Location of Delivery
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter location"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

            </div>
            <div className="bg-[#0b4a6f] text-white text-sm p-3 rounded-lg">
                Note: Please ensure all details are correct before submitting your custom order.
            </div>

            {/* Optional button */}
            <Button 
              onClick={handleSubmit}
              disabled={isPending}
              className="mt-2 bg-black text-white hover:bg-gray-800 p-4">
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>

          </div>
        </div>
      </Card>
    </div>
    </div>
  );
}