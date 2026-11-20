"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner"; // or swap with your toast lib
import { API } from "@/service/dashboardService";

// ─── Constants ────────────────────────────────────────────────────────────────
const POPUP_SUBMITTED_KEY = "user_info_popup_submitted";
const POPUP_LAST_CLOSED_KEY = "user_info_popup_last_closed";
// After the visitor closes the popup it comes back 4 minutes later (also across reloads)
const POPUP_INTERVAL_MS = 4 * 60 * 1000;

// ─── Storage ──────────────────────────────────────────────────────────────────
// The close/submit marks are kept in localStorage AND a cookie. localStorage alone failed:
// www.kuchalagindia.com and kuchalagindia.com each have their own, and some phone
// browsers don't keep it, so after a reload the popup opened again straight away.
// The cookie is set on the main domain so www and non-www share it.
const cookieDomain = (): string => {
  const host = window.location.hostname;
  if (host === "localhost" || /^[\d.]+$/.test(host)) return "";
  return `; domain=.${host.replace(/^www\./, "")}`;
};

const readMark = (key: string): string | null => {
  let local: string | null = null;
  try {
    local = localStorage.getItem(key);
  } catch {}
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  const cookie = match ? decodeURIComponent(match[1]) : null;
  if (key === POPUP_LAST_CLOSED_KEY) {
    // Latest close wins
    const latest = Math.max(Number(local) || 0, Number(cookie) || 0);
    return latest ? String(latest) : null;
  }
  return local ?? cookie;
};

const writeMark = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {}
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${key}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax${cookieDomain()}`;
};

const isUserLoggedIn = (): boolean => {
  try {
    return localStorage.getItem("token") != null;
  } catch {
    return false;
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface UserInfoForm {
  firstName: string;
  lastName: string;
  fullName: string;
  mobileNumber: string;
  location: string;
}

// ─── Stub – replace with your real API call ───────────────────────────────────
async function addUserInfoApi(payload: {
  name: string;
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
    mobileNumber: "",
    location: "",
  });

  // ── Helpers ────────────────────────────────────────────────────────────────
  const closeUserInfoPopup = () => {
    writeMark(POPUP_LAST_CLOSED_KEY, Date.now().toString());
    setShowUserInfoPopup(false);
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  // While closed, open again once 4 minutes have passed since the last close.
  // First visit (never closed) opens straight away.
  useEffect(() => {
    if (showUserInfoPopup) return;

    const hasSubmitted = readMark(POPUP_SUBMITTED_KEY) === "true";
    if (isUserLoggedIn() || hasSubmitted) return;

    // A close stamped in the future (device clock moved back) counts as just now
    const lastClosed = Math.min(Number(readMark(POPUP_LAST_CLOSED_KEY)) || 0, Date.now());
    const wait = Math.max(0, lastClosed + POPUP_INTERVAL_MS - Date.now());

    const timer = setTimeout(() => {
      setShowUserInfoPopup(true);
    }, wait);

    return () => clearTimeout(timer);
  }, [showUserInfoPopup]);

  // Lock body scroll while popup is open
  useEffect(() => {
    document.body.style.overflow = showUserInfoPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showUserInfoPopup]);

  // Close on Escape key (only while open, so it doesn't restart the 4-minute wait)
  useEffect(() => {
    if (!showUserInfoPopup) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUserInfoPopup();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showUserInfoPopup]);

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
        mobileNumber: userInfoForm.mobileNumber,
        location: userInfoForm.location,
      };

      const response = await addUserInfoApi(payload);

      if (response?.success) {
        writeMark(POPUP_SUBMITTED_KEY, "true");
        setShowUserInfoPopup(false);
        setUserInfoForm({
          firstName: "",
          lastName: "",
          fullName: "",
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
                      <input
              name="location"
              placeholder="Location"
              required
              className={inputCls}
              value={userInfoForm.location}
              onChange={handleUserInfoChange}
            />
            </div>

            {/* Location */}

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