"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart, useCategories, useShopByProductFunction } from "@/hooks/useDashboard";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showFunction, setShowFunction] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const pathname = usePathname();
  const { data, refetchCart } = useCart();
  const cartItems = data?.data?.items || [];
  const [localCart, setLocalCart] = useState<any[]>([]);

  const { data: getdataCategory } = useCategories();
  const { data: getdataProductCategory } = useShopByProductFunction();

  const categories = getdataCategory?.data || [];
  const productCategories = getdataProductCategory?.data || [];

  const shopByFunctionCategories = categories.filter(
    (item: any) => item?.isShopByFunction === true
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  useEffect(() => {
    if (data) {
      setLocalCart(data?.data?.items || []);
    }
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsOpen(false);
    router.push("/signin");
  };
  // ── Quantity ──────────────────────────────────────────────────────────────
  const handleIncrease = (index: number) => {
    setLocalCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const handleDecrease = (index: number) => {
    setLocalCart((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      )
    );
  };

  // ── Checkbox ──────────────────────────────────────────────────────────────
  const handleCheckboxChange = (itemKey: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(itemKey) ? next.delete(itemKey) : next.add(itemKey);
      return next;
    });
  };
const handleCheckout = () => {
  const checkoutItems = localCart
    .filter((item, index) => {
      const product = item.productId || item;
      const key = product._id || String(index);
      return selectedItems.has(key);
    })
    .map((item) => {
      const product = item.productId || item;
      return {
        productId: product._id,
        name: product.name,
        price: product.sellingPrice,
        imageUrl: product.imageUrl?.[0],
        quantity: item.quantity || 1,
      };
    });

  if (checkoutItems.length === 0) {
    alert("Please select at least one item to checkout.");
    return;
  }

  localStorage.setItem("checkoutItems", JSON.stringify(checkoutItems));
  setShowCart(false);
  router.push("/checkout");
};
  // ── Total ─────────────────────────────────────────────────────────────────
const selectedTotal = localCart
  .filter((item, index) => {
    const product = item.productId || item;
    return selectedItems.has(product._id || String(index));
  })
  .reduce((sum, item) => {
    const product = item.productId || item;
    return sum + (product.sellingPrice || 0) * (item.quantity || 1);
  }, 0);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Custom Orders", href: "/custom-orders" },
  ];

  const bottomNavItems = [
    { label: "About Us", href: "/aboutUs" },
    { label: "Contact", href: "/contactUs" },
    ...(isLoggedIn
      ? [
          { label: "Order History", href: "/order-history" },
          { label: "Custom Order History", href: "/custom-order-history" },
          { label: "Profile", href: "/profile" },
          { label: "Logout", href: "#" },
        ]
      : [{ label: "Sign In", href: "/signin" }]),
  ];

  return (
    <>
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
  <header className="bg-[#c9b09a] sticky top-0 z-50 shadow-md">
  <div className="max-w-8xl mx-auto py-2 flex items-center justify-between px-6">
    <button
      onClick={() => { setIsOpen(true); setShowCart(false); }}
      className="text-2xl text-[#544120]"
    >
      ☰
    </button>

    <div className="flex justify-center flex-1">
      <img src="/Images/logo.png" className="w-18 h-15" alt="logo" />
    </div>

    <div className="flex items-center gap-4">
      {/* Wishlist heart */}
     <button
      onClick={() => {
        router.push("/wishlist");
      }}
      className="relative group"
      aria-label="Wishlist"
    >
    <FaRegHeart size={22} className="text-black" />
    </button>

      {/* Cart */}
      <div
        className="relative cursor-pointer"
        onClick={() => {
          setShowCart(true);
          setIsOpen(false);
          refetchCart();
        }}
      >
        <ShoppingCart className="w-6 h-6" />
        {localCart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
            {localCart.length}
          </span>
        )}
      </div>
    </div>
  </div>
</header>

      {/* ── SIDEBAR BACKDROP ───────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#f3efe8] shadow-lg
        transform transition-transform duration-300 z-50
        overflow-y-auto scroll-smooth pb-10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {navItems.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <div
              key={label}
              onClick={() => setIsOpen(false)}
              className={`flex items-stretch border-b-2 cursor-pointer
              ${isActive ? "border-gray-900" : "border-gray-400"}`}
            >
              <div className={`w-1 rounded-r transition-all duration-200
                ${isActive ? "bg-blue-500" : "bg-transparent hover:bg-blue-300"}`}
              />
              <Link
                href={href}
                className={`flex-1 pl-5 py-3 text-xl font-medium
                ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-blue-600"}`}
              >
                {label}
              </Link>
            </div>
          );
        })}

        {shopByFunctionCategories.length > 0 && (
          <div className="border-b-2 border-gray-400">
            <div
              onClick={() => { setShowFunction(!showFunction); setShowProduct(false); }}
              className="flex items-center justify-between px-5 py-3 cursor-pointer"
            >
              <span className="text-xl text-gray-500">Shop by Function</span>
              <span>{showFunction ? "−" : "+"}</span>
            </div>
            {showFunction && (
              <div className="bg-[#eae3d8]">
                {shopByFunctionCategories.map((item: any) => (
                  <Link key={item._id} href={`/categories/${item._id}`} onClick={() => setIsOpen(false)}>
                    <div className="pl-10 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition border-b border-gray-300">
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="border-b-2 border-gray-400">
          <div
            onClick={() => { setShowProduct(!showProduct); setShowFunction(false); }}
            className="flex items-center justify-between px-5 py-3 cursor-pointer"
          >
            <span className="text-xl text-gray-500">Shop by Product</span>
            <span>{showProduct ? "−" : "+"}</span>
          </div>
          {showProduct && (
            <div className="bg-[#eae3d8]">
              {productCategories.map((item: any) => (
                <Link key={item._id} href={`/categories/${item._id}`} onClick={() => setIsOpen(false)}>
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
              onClick={() => { if (label === "Logout") { handleLogout(); } else { setIsOpen(false); } }}
              className={`flex items-stretch border-b-2 cursor-pointer
              ${isActive ? "border-gray-900" : "border-gray-400"}`}
            >
              <div className={`w-1 rounded-r transition-all duration-200
                ${isActive ? "bg-blue-500" : "bg-transparent hover:bg-blue-300"}`}
              />
              {label === "Logout" ? (
                <span className="flex-1 pl-5 py-3 text-xl font-medium text-red-500 hover:text-red-700">
                  Logout
                </span>
              ) : (
                <Link
                  href={href}
                  className={`flex-1 pl-5 py-3 text-xl font-medium
                  ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-blue-600"}`}
                >
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* ── CART BACKDROP ──────────────────────────────────────────────────── */}
      {showCart && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowCart(false)} />
      )}

      {/* ── CART SLIDER ────────────────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg
        transform transition-transform duration-300 z-50 flex flex-col
        ${showCart ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-4 border-b font-bold text-lg flex justify-between items-center shrink-0">
          <span>Cart</span>
          <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-black">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {localCart.length === 0 ? (
            <p className="text-gray-400 text-center mt-16 text-sm">Your cart is empty</p>
          ) : (
            localCart.map((item: any, index: number) => {
              const product = item.productId || item;
              const itemKey = product._id || String(index);
              const isChecked = selectedItems.has(itemKey);
              const qty = item.quantity || 1;

              return (
                <div
                  key={index}
                  className={`flex gap-3 rounded-xl border p-3 transition-all duration-200
                  ${isChecked ? "border-[#17587c] bg-blue-50" : "border-gray-200 bg-white"}`}
                >
                  {/* Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(itemKey)}
                      className="w-4 h-4 accent-[#17587c] cursor-pointer"
                    />
                  </div>

                  {/* Image */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${product.imageUrl?.[0]}`}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />

                  {/* Info */}
                  <div className="flex flex-col flex-1 gap-1 min-w-0">
                    <span className="font-semibold text-sm leading-tight truncate">
                      {product.name}
                    </span>
                    <span className="text-[#17587c] font-bold text-sm">
                      ₹ {product.sellingPrice}
                    </span>

                    {/* +/- Controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleDecrease(index)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center
                        justify-center text-gray-600 hover:bg-gray-100 transition font-bold text-base leading-none"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold w-5 text-center">{qty}</span>
                      <button
                        onClick={() => handleIncrease(index)}
                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center
                        justify-center text-gray-600 hover:bg-gray-100 transition font-bold text-base leading-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Summary + Checkout */}
        {localCart.length > 0 && (
          <div className="shrink-0 border-t p-4 flex flex-col gap-3 bg-white">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{selectedItems.size} item(s) selected</span>
              <span className="font-bold text-gray-800">₹ {selectedTotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={selectedItems.size === 0}
              className="w-full bg-[#17587c] hover:bg-[#0f3f5a] text-white font-semibold
              rounded-xl py-3 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}