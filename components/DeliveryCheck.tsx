"use client";

import { useState } from "react";
import { FiTruck, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useSiteSettings } from "@/hooks/useDashboard";
import { DEFAULT_DELIVERY, type DeliverySettings } from "@/service/dashboardService";

const PIN_KEY = "delivery_pincode";
// Indian pincodes: 6 digits, never starting with 0
const isValidPincode = (p: string) => /^[1-9][0-9]{5}$/.test(p);

const rupees = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const dayLabel = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + (Number(n) || 0));
  return d;
};

// "expected by 12 Nov" or "expected between 12 Nov – 15 Nov", from the admin's delivery days
export const deliveryWindow = (s: DeliverySettings) =>
  s.deliveryDaysType === "range" && s.deliveryDaysMax > s.deliveryDaysMin
    ? `expected between ${dayLabel(inDays(s.deliveryDaysMin))} – ${dayLabel(inDays(s.deliveryDaysMax))}`
    : `expected by ${dayLabel(inDays(s.deliveryDaysMin))}`;

export default function DeliveryCheck({ price }: { price: number }) {
  const { data } = useSiteSettings();
  const settings: DeliverySettings = data || DEFAULT_DELIVERY;
  // Brings back the pincode the customer checked last time. Only rendered in the browser
  // (the product page loads on the client), so reading localStorage here is safe.
  const [saved] = useState(() => {
    try {
      const p = typeof window !== "undefined" ? localStorage.getItem(PIN_KEY) || "" : "";
      return isValidPincode(p) ? p : "";
    } catch {
      return "";
    }
  });
  const [pincode, setPincode] = useState(saved);
  const [checked, setChecked] = useState<string | null>(saved || null);
  const [error, setError] = useState("");

  const check = () => {
    if (!isValidPincode(pincode)) {
      setChecked(null);
      setError("Enter a valid 6-digit pincode");
      return;
    }
    setError("");
    setChecked(pincode);
    try {
      localStorage.setItem(PIN_KEY, pincode);
    } catch {}
  };

  const charge = Math.max(0, Number(settings.deliveryCharge) || 0);
  const freeAbove = Math.max(0, Number(settings.freeDeliveryAbove) || 0);
  const freeForThis = charge === 0 || (freeAbove > 0 && price > freeAbove);

  return (
    <div className="arial-font">
      <label htmlFor="delivery-pincode" className="mb-2 flex items-center gap-2 text-base font-semibold text-[#2b2118]">
        <FiTruck className="text-[#b32126]" /> Check delivery
      </label>
      <div className="flex max-w-md gap-3">
        <input
          id="delivery-pincode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
            setError("");
            if (checked) setChecked(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Enter pincode"
          aria-invalid={!!error}
          aria-describedby="delivery-result"
          className={`min-w-0 flex-1 rounded-lg border px-4 py-2.5 text-base tracking-wider outline-none transition focus:border-[#b32126] focus:ring-2 focus:ring-[#b32126]/15 ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={check}
          className="shrink-0 rounded-lg border border-[#b32126] bg-[#fdf1f1] px-6 py-2.5 font-semibold text-[#b32126] transition hover:bg-[#b32126] hover:text-white"
        >
          Check
        </button>
      </div>

      <div id="delivery-result" aria-live="polite" className="mt-2 min-h-[1.25rem]">
        {error && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-red-600">
            <FiAlertCircle /> {error}
          </p>
        )}
        {checked && (
          <>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <FiCheckCircle /> Delivery available to {checked} · {deliveryWindow(settings)}
            </p>
            <p className="mt-0.5 text-sm text-gray-600">
              {freeForThis
                ? "Free delivery on this item"
                : `${rupees(charge)} delivery charge added at checkout${
                    freeAbove > 0 ? ` · free on orders above ${rupees(freeAbove)}` : ""
                  }`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
