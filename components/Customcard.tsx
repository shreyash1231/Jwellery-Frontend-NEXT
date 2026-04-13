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

export default function Customcard() {
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
           <div className="flex flex-col gap-5 p-6 md:p-10 w-full md:w-1/2 justify-center">

            <h2 className="text-2xl md:text-3xl font-semibold">
              Custom Orders
            </h2>

            {/* Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Type of Order</label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Select Type
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>Bulk</DropdownMenuItem>
                    <DropdownMenuItem>Bridesmaid</DropdownMenuItem>
                    <DropdownMenuItem>Best Man</DropdownMenuItem>
                    <DropdownMenuItem>Single</DropdownMenuItem>
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
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Location of Delivery
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                />
              </div>

            </div>
            <div className="bg-[#0b4a6f] text-white text-sm p-3 rounded-lg">
                Note: Please ensure all details are correct before submitting your custom order.
            </div>

            {/* Optional button */}
            <Button className="mt-2 bg-black text-white hover:bg-gray-800 p-4">
              Submit Request
            </Button>

          </div>
        </div>
      </Card>
    </div>
  );
}