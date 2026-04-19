"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner"; // or swap with your toast lib
import { API } from "@/service/dashboardService";

// ─── Constants ────────────────────────────────────────────────────────────────
const POPUP_SUBMITTED_KEY = "user_info_popup_submitted";
const POPUP_LAST_CLOSED_KEY = "user_info_popup_last_closed";
const POPUP_INTERVAL_MS = 3 *1000; // 2 minutes

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserInfoForm {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  location: string;
}

// ─── Stub – replace with your real API call ───────────────────────────────────
async function addUserInfoApi(payload: {
  name: string;
  email: string;
  mobileNumber: string;
  location: string;
}): Promise<{ success: boolean }> {
  const response = await fetch(
    `${API}/api/v1/user/add-user-info`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data; // { success: true, message: "...", data: {...} }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PopUp() {
  const [showUserInfoPopup, setShowUserInfoPopup] = useState(false);
  const [submittingUserInfo, setSubmittingUserInfo] = useState(false);
  const [userInfoForm, setUserInfoForm] = useState<UserInfoForm>({
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    location: "",
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const isUserLoggedIn = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("token") != null;
  };

  const closeUserInfoPopup = () => {
    localStorage.setItem(POPUP_LAST_CLOSED_KEY, Date.now().toString());
    setShowUserInfoPopup(false);
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  // Stamp "last closed" on first load (so interval starts from now)
  useEffect(() => {
    const hasSubmitted = localStorage.getItem(POPUP_SUBMITTED_KEY) === "true";
    if (isUserLoggedIn() || hasSubmitted) return;
    localStorage.setItem(POPUP_LAST_CLOSED_KEY, Date.now().toString());
  }, []);

  // Poll every 30 s; show popup once interval has elapsed
  useEffect(() => {
    const intervalId = setInterval(() => {
      const hasSubmitted = localStorage.getItem(POPUP_SUBMITTED_KEY) === "true";
      if (isUserLoggedIn() || hasSubmitted || showUserInfoPopup) return;

      const lastClosed = parseInt(
        localStorage.getItem(POPUP_LAST_CLOSED_KEY) ?? "0",
        10
      );

      if (Date.now() - lastClosed >= POPUP_INTERVAL_MS) {
        setShowUserInfoPopup(true);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showUserInfoPopup]);

  // Lock body scroll while popup is open
  useEffect(() => {
    document.body.style.overflow = showUserInfoPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showUserInfoPopup]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUserInfoPopup();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfoForm((prev) => {
      const updated = { ...prev, [name]: value };
      updated.fullName = `${updated.firstName} ${updated.lastName}`.trim();
      return updated;
    });
  };

  const submitUserInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmittingUserInfo(true);

      const payload = {
        name: userInfoForm.fullName,
        email: userInfoForm.email,
        mobileNumber: userInfoForm.mobileNumber,
        location: userInfoForm.location,
      };

      const response = await addUserInfoApi(payload);

      if (response?.success) {
        localStorage.setItem(POPUP_SUBMITTED_KEY, "true");
        setShowUserInfoPopup(false);
        setUserInfoForm({
          firstName: "",
          lastName: "",
          fullName: "",
          email: "",
          mobileNumber: "",
          location: "",
        });
        toast.success("Thank you! We'll be in touch.");
      }
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Failed to submit user info";
      console.error(msg);
      toast.error("Something went wrong!");
    } finally {
      setSubmittingUserInfo(false);
    }
  };

  // ── Shared input classes ───────────────────────────────────────────────────
  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-[#c8a97e] focus:ring-2 focus:ring-[#c8a97e]/20";

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!showUserInfoPopup) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) closeUserInfoPopup();
      }}
    >
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Close button */}
        <button
          onClick={closeUserInfoPopup}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-xl leading-none text-gray-600 backdrop-blur-sm transition hover:bg-white hover:text-gray-900"
        >
          ×
        </button>

        {/* Hero image */}
        <div className="relative h-[200px] w-full">
          <Image
            src="/Images/popupImage.jpeg"
            alt="KuchalagIndia welcome"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Body */}
        <div className="p-6">
          <h3 className="text-center text-lg font-semibold text-gray-900">
            Welcome To{" "}
            <span className="text-[#c8a97e]">KuchalagIndia</span>
          </h3>

          <p className="mb-4 mt-1 text-center text-sm italic text-gray-500">
            5% off on your 1st order after you subscribe to us
          </p>

          <form onSubmit={submitUserInfo} className="space-y-3">
            {/* First / Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                placeholder="First Name"
                required
                className={inputCls}
                value={userInfoForm.firstName}
                onChange={handleUserInfoChange}
              />
              <input
                name="lastName"
                placeholder="Last Name"
                required
                className={inputCls}
                value={userInfoForm.lastName}
                onChange={handleUserInfoChange}
              />
            </div>

            {/* Email / Mobile */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className={inputCls}
                value={userInfoForm.email}
                onChange={handleUserInfoChange}
              />
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                className={inputCls}
                value={userInfoForm.mobileNumber}
                onChange={handleUserInfoChange}
              />
            </div>

            {/* Location */}
            <input
              name="location"
              placeholder="Location"
              required
              className={inputCls}
              value={userInfoForm.location}
              onChange={handleUserInfoChange}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={submittingUserInfo}
              className="w-full rounded-lg bg-black py-3 text-sm font-semibold tracking-widest text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submittingUserInfo ? "Submitting…" : "SUBMIT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}