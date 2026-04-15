"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCategories, useShopByProductFunction } from "@/hooks/useDashboard";
import { useRouter } from "next/navigation";
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFunction, setShowFunction] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token"); // or your key name
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if you're storing user data

    setIsLoggedIn(false);
    setIsOpen(false);

    router.push("/signin"); // redirect after logout
  };
  const pathname = usePathname();

  const { data: getdataCategory } = useCategories();
  const { data: getdataProductCategory } = useShopByProductFunction();

  const categories = getdataCategory?.data || [];
  const productCategories = getdataProductCategory?.data || [];

  const shopByFunctionCategories = categories.filter(
    (item: any) => item?.isShopByFunction === true
  );

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Custom Orders", href: "/custom-orders" },
  ];

  const bottomNavItems = [
    { label: "About Us", href: "/AboutUs" },
    { label: "Contact", href: "/contactUs" },

    ...(isLoggedIn
      ? [
          { label: "Order History", href: "/order-history" },
          { label: "Custom Order History", href: "/custom-order-history" },
          { label: "Profile", href: "/profile" },
          { label: "Logout", href: "#" }, // optional
        ]
      : [{ label: "Sign In", href: "/signin" }]),
  ];

  return (
    <>
      {/* HEADER */}
      <header className="bg-[#c9b09a] sticky top-0 z-50 shadow-md">
        <div className="max-w-8xl mx-auto py-2 flex items-center justify-start pl-8">
          <button
            onClick={() => setIsOpen(true)}
            className="text-2xl text-[#544120]"
          >
            ☰
          </button>

          <div className="flex justify-center flex-1">
            <img src="/Images/logo.png" className="w-18 h-15" alt="logo" />
          </div>

          <div className="w-6"></div>
        </div>
      </header>

      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
     <div
  className={`fixed top-0 left-0 h-full w-64 bg-[#f3efe8] shadow-lg 
  transform transition-transform duration-300 z-50 
  overflow-y-auto scroll-smooth pb-10
  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
>
        {/* TOP NAV */}
        {navItems.map(({ label, href }) => {
          const isActive = pathname === href;

          return (
            <div
              key={label}
              onClick={() => setIsOpen(false)}
              className={`flex items-stretch border-b-2 cursor-pointer
              ${isActive ? "border-gray-900" : "border-gray-400"}`}
            >
              <div
                className={`w-1 rounded-r transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-500"
                    : "bg-transparent hover:bg-blue-300"
                }`}
              />

              <Link
                href={href}
                className={`flex-1 pl-5 py-3 text-xl font-medium
                ${
                  isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-500 hover:text-blue-600"
                }`}
              >
                {label}
              </Link>
            </div>
          );
        })}

        {/* SHOP BY FUNCTION */}
        {shopByFunctionCategories.length > 0 && (
          <div className="border-b-2 border-gray-400">
            <div
              onClick={() => {
                setShowFunction(!showFunction);
                setShowProduct(false); // close other
              }}
              className="flex items-center justify-between px-5 py-3 cursor-pointer"
            >
              <span className="text-xl text-gray-500">
                Shop by Function
              </span>
              <span>{showFunction ? "−" : "+"}</span>
            </div>

            {showFunction && (
              <div className="bg-[#eae3d8]">
                {shopByFunctionCategories.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/categories/${item._id}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="pl-10 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition border-b border-gray-300">
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SHOP BY PRODUCT */}
        <div className="border-b-2 border-gray-400">
          <div
            onClick={() => {
              setShowProduct(!showProduct);
              setShowFunction(false); // close other
            }}
            className="flex items-center justify-between px-5 py-3 cursor-pointer"
          >
            <span className="text-xl text-gray-500">
              Shop by Product
            </span>
            <span>{showProduct ? "−" : "+"}</span>
          </div>

          {showProduct && (
            <div className="bg-[#eae3d8]">
              {productCategories.map((item: any) => (
                <Link
                  key={item._id}
                  href={`/categories/${item._id}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="pl-10 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition border-b border-gray-300">
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {bottomNavItems.map(({ label, href }) => {
          const isActive = pathname === href;

          return (
            <div
              key={label}
              onClick={() => {
                if (label === "Logout") {
                  handleLogout();   
                } else {
                  setIsOpen(false);
                }
              }}
              className={`flex items-stretch border-b-2 cursor-pointer
              ${isActive ? "border-gray-900" : "border-gray-400"}`}
            >
              <div
                className={`w-1 rounded-r transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-500"
                    : "bg-transparent hover:bg-blue-300"
                }`}
              />

              {label === "Logout" ? (
                <span className="flex-1 pl-5 py-3 text-xl font-medium text-red-500 hover:text-red-700">
                  Logout
                </span>
              ) : (
                <Link
                  href={href}
                  className={`flex-1 pl-5 py-3 text-xl font-medium
                  ${
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {label}
                </Link>
              )}
            </div>
          );
          })}
      </div>
    </>
  );
}