"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API, validateCouponApi } from "@/service/dashboardService";
import { useNewFeatures } from "@/hooks/useDashboard";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";

// ── Razorpay type declaration ─────────────────────────────────────────────────
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ── Load Razorpay script dynamically (only once) ──────────────────────────────
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const newFeatures = useNewFeatures();
  // Old version reports coupon problems as toasts instead of under the box
  const showCouponError = (msg: string) =>
    newFeatures ? setCouponError(msg) : toast.error(msg);

  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [addressId, setAddressId] = useState<string | null>(null);

  const [form, setForm] = useState({
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    contactNumber: "",
    email: "", // guest only
  });

  // ─── Load cart items ──────────────────────────────────────────────────────
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    setItems(data);
  }, []);

  // ─── Fetch saved address (logged-in) ─────────────────────────────────────
  useEffect(() => {
    const fetchAddress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API}/api/v1/user/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const addr = res.data?.data;
        if (!addr) return;
        setSavedAddress(addr);
        setAddressId(addr._id);
        setForm({
          country: addr.country || "India",
          firstName: addr.firstName || "",
          lastName: addr.lastName || "",
          address: addr.address || "",
          apartment: addr.apartment || "",
          city: addr.city || "",
          state: addr.state || "",
          pincode: addr.pincode || "",
          contactNumber: addr.contactNumber || "",
          email: "",
        });
      } catch {
        toast.error("Could not load saved address.");
      }
    };
    fetchAddress();
  }, []);

  // ─── Fetch coupons (logged-in) ────────────────────────────────────────────
  useEffect(() => {
    const fetchCoupons = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API}/api/v1/user/get-all-user-coupons`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoupons(res.data.data || []);
      } catch {
        toast.error("Could not load coupons.");
      }
    };
    fetchCoupons();
  }, []);

  // ─── Derived ──────────────────────────────────────────────────────────────
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const isAddressChanged = (): boolean => {
    if (!savedAddress) return false;
    const fields: (keyof typeof form)[] = [
      "country", "firstName", "lastName", "address",
      "apartment", "city", "state", "pincode", "contactNumber",
    ];
    return fields.some((key) => form[key] !== (savedAddress[key] ?? ""));
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateQuantity = (index: number, delta: number) => {
    setItems((prev) => {
      const updated = prev
        .map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0);
      localStorage.setItem("checkoutItems", JSON.stringify(updated));
      return updated;
    });
  };

  // The backend is the source of truth: it checks active/expiry/usage/min order/
  // per-user limits and returns the exact discount the order will get
  const applyCoupon = async (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    setCouponError("");
    setShowDropdown(false);

    if (!code) {
      showCouponError("Please enter a coupon code.");
      return;
    }
    if (!/^[A-Z0-9]{3,20}$/.test(code)) {
      showCouponError("Coupon codes have 3–20 letters or numbers, with no spaces or symbols.");
      return;
    }
    if (subtotal <= 0) {
      showCouponError("Your cart is empty.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      showCouponError("Please log in to use coupons.");
      return;
    }

    setApplyingCoupon(true);
    try {
      const result = await validateCouponApi(code, subtotal, token);
      setDiscount(result.discount);
      setAppliedCoupon(result.coupon);
      setCouponCode(result.coupon.code);
      if (newFeatures) setConfettiKey((k) => k + 1);
      else toast.success(`"${result.coupon.code}" applied! You save ₹${Number(result.discount).toFixed(2)}`);
    } catch (err: any) {
      showCouponError(
        err?.response?.data?.message || "Could not apply this coupon. Please try again."
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
    setCouponError("");
    toast("Coupon removed.", { icon: "🗑️" });
  };

  // Quantities changed: re-check the applied coupon against the new subtotal
  useEffect(() => {
    if (!appliedCoupon) return;
    const token = localStorage.getItem("token");
    const code = appliedCoupon.code;
    if (!token || subtotal <= 0) {
      setAppliedCoupon(null);
      setDiscount(0);
      return;
    }
    validateCouponApi(code, subtotal, token)
      .then((result) => setDiscount(result.discount))
      .catch((err: any) => {
        setAppliedCoupon(null);
        setDiscount(0);
        showCouponError(
          `"${code}" was removed: ${err?.response?.data?.message || "it no longer applies to this cart."}`
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  // ─── Open Razorpay ────────────────────────────────────────────────────────
  // `orderData` is the object inside res.data.data from your order/create API.
  // It must contain `amount`, `currency`, and `razorpayOrderId` (or whichever
  // field your backend returns for the Razorpay order id).
const openRazorpay = async (orderData: any) => {
  const loaded = await loadRazorpayScript();
  const token = localStorage.getItem("token");
  if (!loaded) {
    toast.error("Failed to load payment gateway.");
    setLoading(false);
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

    amount: orderData.amount, // ✅ already in paise
    currency: orderData.currency || "INR",

    name: "Your Store Name",
    description: "Order Payment",

    order_id: orderData.razorpayOrderId, // ✅ MOST IMPORTANT
    
    handler: async function (response: any) {
      try {
        const verifyRes = await axios.post(
          `${API}/api/v1/user/verify-payment`,
          {
            orderId: orderData.orderId, // DB orderId
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
          token
            ? {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : {} // no headers for guest
        );

        if (verifyRes.data?.success) {
          toast.success("Payment verified & order placed 🎉");

          localStorage.removeItem("checkoutItems");
          setItems([]);

          router.push(`/payment-success?orderId=${orderData.orderId}`);
        } else {
          toast.error("Payment verification failed ❌");
        }
      } catch (err) {
        toast.error("Verification failed. Please contact support.");
      } finally {
        setLoading(false);
      }
    },

    modal: {
      ondismiss: () => {
        toast("Payment cancelled.", { icon: "⚠️" });
        setLoading(false);
      },
    },
  };

  const rzp = new window.Razorpay(options);

  rzp.on("payment.failed", function (response: any) {
    toast.error(response.error?.description || "Payment failed");
    setLoading(false);
  });

  rzp.open();
};

  // ─── Place Order ──────────────────────────────────────────────────────────
  const handleCreateOrder = async () => {
    // Validate required fields
    if (!form.firstName || !form.address || !form.city || !form.pincode || !form.contactNumber) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }
    if (!isLoggedIn && !form.email) {
      toast.error("Please enter your email to continue as guest.");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const toastId = toast.loading("Creating your order...");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let orderData: any;

      if (token) {
        // ── LOGGED-IN FLOW ────────────────────────────────────────────
        let resolvedAddressId = addressId;
        if (!addressId) {
          const createRes = await axios.post(
            `${API}/api/v1/user/address`,
            {
              country: form.country,
              firstName: form.firstName,
              lastName: form.lastName,
              contactNumber: form.contactNumber,
              address: form.address,
              apartment: form.apartment,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              label: "Home",
              isDefault: true,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const newAddr = createRes.data?.data?.data;
          resolvedAddressId= newAddr._id;
          setAddressId(newAddr._id);
          setSavedAddress(newAddr);
        }
        // 1. Patch address if changed
        else if(isAddressChanged() && addressId) {
          await axios.patch(
            `${API}/api/v1/user/address/${addressId}`,
            {
              country: form.country,
              firstName: form.firstName,
              lastName: form.lastName,
              contactNumber: form.contactNumber,
              address: form.address,
              apartment: form.apartment,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              label: savedAddress?.label || "Home",
              isDefault: savedAddress?.isDefault ?? true,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // 2. Create order
        const payload: any = {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          addressId:resolvedAddressId,
          currency: "INR",
        };
        if (appliedCoupon) payload.couponCode = appliedCoupon.code;

        const res = await axios.post(
          `${API}/api/v1/user/order/create`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        orderData = res.data?.data;
      } else {
        // ── GUEST FLOW ────────────────────────────────────────────────

        const payload: any = {
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: {
            country: form.country,
            firstName: form.firstName,
            lastName: form.lastName,
            contactNumber: form.contactNumber,
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          guestContact: { email: form.email },
          currency: "INR",
        };
        if (appliedCoupon) payload.couponCode = appliedCoupon.code;

        const res = await axios.post(`${API}/api/v1/user/order/create`, payload);
        orderData = res.data?.data;
      }

      toast.dismiss(toastId);
      toast.success("Order created! Initializing payment...");

      try {
        // 👉 STEP 1: Call payment API using orderId
        const paymentRes = await axios.post(
          `${API}/api/v1/user/payment/create/${orderData._id}`,
          {
            paymentMethod: "ONLINE",
          },
          token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {}
        );

        // 👉 STEP 2: Get Razorpay data
        const paymentData = paymentRes.data?.data;

        if (!paymentData?.razorpayOrder?.id) { 
          throw new Error("Invalid payment response");
        }

        await openRazorpay({
          orderId: paymentData.payment.orderId,              // ✅ FIXED
          razorpayOrderId: paymentData.razorpayOrder.id,     // ✅ FIXED
          amount: paymentData.razorpayOrder.amount,          // ✅ KEEP IN PAISE
          currency: paymentData.razorpayOrder.currency,
        });

      } catch (err: any) {
        console.error("Payment init error:", err);

        toast.error(
          err?.response?.data?.message || "Failed to initialize payment"
        );

        setLoading(false);
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err?.response?.data?.message || "Order failed. Please try again.");
      setLoading(false);
    }
  };

  const shippingCharge = (subtotal - discount) <= 5000 ? 200 : 0;
  const isLoggedIn =
    typeof window !== "undefined" ? !!localStorage.getItem("token") : false;

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <>

      {newFeatures && <Confetti fireKey={confettiKey} />}

      <div className="min-h-screen p-6 arial-font">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#555] hover:text-black font-medium text-xl"
          >
            ← Back to Home
          </button>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: SHIPPING FORM */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

            <div className="flex flex-col gap-4">
              <select name="country" value={form.country} onChange={handleChange} className="border p-3 rounded-lg">
                <option value="India">India</option>
              </select>

              <div className="flex gap-4">
                <input name="firstName" placeholder="First Name *" value={form.firstName} onChange={handleChange} className="border p-3 rounded-lg w-full" />
                <input name="lastName"  placeholder="Last Name"    value={form.lastName}  onChange={handleChange} className="border p-3 rounded-lg w-full" />
              </div>

              <input name="address"   placeholder="Address *"                   value={form.address}   onChange={handleChange} className="border p-3 rounded-lg" />
              <input name="apartment" placeholder="Apartment / Suite (optional)" value={form.apartment} onChange={handleChange} className="border p-3 rounded-lg" />

              <div className="flex gap-4">
                <input name="city"    placeholder="City *"    value={form.city}    onChange={handleChange} className="border p-3 rounded-lg w-full" />
                <input name="state"   placeholder="State"     value={form.state}   onChange={handleChange} className="border p-3 rounded-lg w-full" />
                <input name="pincode" placeholder="Pincode *" value={form.pincode} onChange={handleChange} className="border p-3 rounded-lg w-full" />
              </div>

              <input name="contactNumber" placeholder="Contact Number *" value={form.contactNumber} onChange={handleChange} className="border p-3 rounded-lg" />

              {!isLoggedIn && (
                <input name="email" placeholder="Email * (for order updates)" value={form.email} onChange={handleChange} className="border p-3 rounded-lg" />
              )}
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="bg-white rounded-2xl p-6 shadow-md h-fit">

            {items.map((item, index) => (
              <div key={index} className="flex gap-4 mb-4 items-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.imageUrl}`}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  alt={item.name}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-semibold text-sm truncate">{item.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQuantity(index, -1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg leading-none">−</button>
                    <span className="w-5 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, +1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-lg leading-none">+</button>
                  </div>
                </div>
                <span className="font-semibold text-sm flex-shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            {/* Coupon */}
            {items.length > 0 && (
              <div className="relative my-4">
                <div className="flex gap-2">
                  {!isLoggedIn ? (
                    <div className="w-full border p-2 rounded-lg text-sm text-gray-400 bg-gray-50 text-center">
                      🔒 Login to use coupons
                    </div>
                  ) : (
                    <>
                      <input
                        placeholder="Discount code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value.toUpperCase().replace(/\s/g, ""));
                          setCouponError("");
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !appliedCoupon && !applyingCoupon) applyCoupon(couponCode);
                        }}
                        maxLength={20}
                        aria-invalid={!!couponError}
                        className={
                          newFeatures
                            ? `border p-2 w-20 rounded-lg flex-1 uppercase tracking-wide ${
                                couponError ? "border-red-500 coupon-shake" : ""
                              } ${appliedCoupon ? "border-green-500 bg-green-50 text-green-800 font-semibold" : ""}`
                            : "border p-2 w-20 rounded-lg flex-1"
                        }
                        disabled={!!appliedCoupon || applyingCoupon}
                      />
                      {appliedCoupon ? (
                        newFeatures ? (
                          <span className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1">
                            ✓ Applied
                          </span>
                        ) : (
                          <button onClick={removeCoupon} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Remove</button>
                        )
                      ) : (
                        <button
                          onClick={() => applyCoupon(couponCode)}
                          disabled={applyingCoupon}
                          className="px-3 py-2 bg-red-700 text-white rounded-lg text-sm font-medium disabled:opacity-60 min-w-[76px]"
                        >
                          {applyingCoupon ? "Checking…" : "Apply"}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {showDropdown && !appliedCoupon && coupons.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                    {coupons
                      .filter((c) => c.code.toLowerCase().includes(couponCode.toLowerCase()))
                      .map((coupon) => {
                        const shortBy = (coupon.minOrderValue || 0) - subtotal;
                        return (
                          <div
                            key={coupon.id}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => applyCoupon(coupon.code)}
                            className="p-1 md:p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm">{coupon.code}</span>
                              <span className="text-green-600 text-sm font-medium">
                                {coupon.type === "PERCENT"
                                  ? `${coupon.value}% OFF${newFeatures && coupon.maxDiscount ? ` (up to ₹${coupon.maxDiscount})` : ""}`
                                  : `₹${coupon.value} OFF`}
                              </span>
                            </div>
                            {!newFeatures ? (
                              <p className="text-xs text-gray-400 mt-0.5">Min order ₹{coupon.minOrderValue}</p>
                            ) : shortBy > 0 ? (
                              <p className="text-xs text-amber-600 mt-0.5">
                                Add ₹{shortBy.toLocaleString("en-IN")} more to unlock
                              </p>
                            ) : (
                              <p className="text-xs text-gray-400 mt-0.5">
                                {coupon.minOrderValue ? `Min order ₹${coupon.minOrderValue}` : "No minimum order"}
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}

                {couponError && !appliedCoupon && (
                  <p role="alert" className="text-red-600 text-xs mt-1.5">
                    {couponError}
                  </p>
                )}

                {appliedCoupon && !newFeatures && (
                  <p className="text-green-600 text-xs mt-1">
                    ✅ "{appliedCoupon.code}" applied — you save ₹{discount.toFixed(2)}
                  </p>
                )}

                {appliedCoupon && newFeatures && (
                  <div
                    key={confettiKey}
                    className="coupon-pop mt-3 flex items-center gap-3 rounded-xl border-2 border-dashed border-green-500 bg-gradient-to-r from-green-50 via-emerald-50 to-amber-50 p-3"
                  >
                    <span className="text-3xl" aria-hidden>🎉</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-green-700 font-extrabold tracking-widest text-sm">
                        COUPON APPLIED!
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{appliedCoupon.code}</span> — you saved{" "}
                        <span className="font-bold text-green-700">₹{discount.toLocaleString("en-IN")}</span>
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-gray-500 underline hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pricing */}
            <div className="text-sm text-gray-600 flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && items.length > 0 && (
              <div className="text-sm text-green-600 flex justify-between mt-1">
                <span>Discount</span>
                <span>- ₹{discount.toFixed(2)}</span>
              </div>
            )}

            {items.length > 0 && (
              <div className="text-sm text-gray-600 flex justify-between mt-1">
                <span>Shipping Charges</span>
                {shippingCharge > 0 ? (
                  <span>₹{shippingCharge.toFixed(2)}</span>
                ) : (
                  <span className="text-green-600">Free</span>
                )}
              </div>
            )}
            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              {items.length > 0 ? (
                <span>₹{(subtotal - discount + shippingCharge).toFixed(2)}</span>  
              ) : (
                <span className="text-gray-400 text-sm font-normal">No items in cart</span>
              )}
            </div>

            <button
              onClick={handleCreateOrder}
              disabled={loading || items.length === 0}
              className="w-full mt-6 bg-red-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}