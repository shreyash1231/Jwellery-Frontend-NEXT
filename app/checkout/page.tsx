"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://render-jwellery-application-1.onrender.com"; // change if needed

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");

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
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    setItems(data);
  }, []);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🔹 Handle input change
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.placeholder]: e.target.value });
  };

  // 🔹 CREATE ORDER API CALL
  const handleCreateOrder = async () => {
    try {
      setLoading(true);

      const payload = {
        items: items.map((item) => ({
          productId: item._id,
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

        couponCode: couponCode || undefined,
        currency: "INR",
      };

      const token = localStorage.getItem("token"); // if logged in

      const res = await axios.post(
        `${API}/api/v1/order/create`,
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      alert("✅ Order placed successfully!");

      console.log(res.data);

      // Optional: clear cart
      localStorage.removeItem("checkoutItems");

    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: SHIPPING FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

          <div className="flex flex-col gap-4">

            <select className="border p-3 rounded-lg">
              <option>India</option>
            </select>

            <div className="flex gap-4">
              <input placeholder="firstName" onChange={handleChange} className="border p-3 rounded-lg w-full" />
              <input placeholder="lastName" onChange={handleChange} className="border p-3 rounded-lg w-full" />
            </div>

            <input placeholder="address" onChange={handleChange} className="border p-3 rounded-lg" />

            <input placeholder="apartment" onChange={handleChange} className="border p-3 rounded-lg" />

            <div className="flex gap-4">
              <input placeholder="city" onChange={handleChange} className="border p-3 rounded-lg w-full" />
              <input placeholder="state" onChange={handleChange} className="border p-3 rounded-lg w-full" />
              <input placeholder="pincode" onChange={handleChange} className="border p-3 rounded-lg w-full" />
            </div>

            <input placeholder="contactNumber" onChange={handleChange} className="border p-3 rounded-lg" />
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="bg-white rounded-2xl p-6 shadow-md h-fit">

          {items.map((item, index) => (
            <div key={index} className="flex gap-4 mb-4">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.imageUrl}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex flex-col">
                <span className="font-semibold">{item.name}</span>
                <span className="text-gray-500 text-sm">
                  Qty: {item.quantity}
                </span>
              </div>
              <span className="ml-auto font-semibold">
                ₹{item.price}
              </span>
            </div>
          ))}

          {/* Coupon */}
          <div className="flex gap-2 my-4">
            <input
              placeholder="Discount code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="border p-2 rounded-lg flex-1"
            />
          </div>

          {/* Pricing */}
          <div className="text-sm text-gray-600 flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="w-full mt-6 bg-red-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}