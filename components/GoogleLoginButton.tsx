"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { API } from "@/service/dashboardService";

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false); // ✅ track if initialize() was already called
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const renderButton = () => {
      if (!isMounted || !buttonRef.current || !wrapperRef.current) return;
      if (!window.google?.accounts?.id) return;

      const containerWidth = wrapperRef.current.offsetWidth ?? 300;
      const buttonWidth = Math.min(Math.max(containerWidth, 200), 400);

      buttonRef.current.innerHTML = "";

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: buttonWidth,
      });
    };

    const initGoogle = () => {
      if (!isMounted || !window.google?.accounts?.id) return;

      // ✅ Only call initialize() once — never again on resize
      if (!initializedRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (res: any) => {
            const idToken = res?.credential;
            if (!idToken) { toast.error("Google login failed ❌"); return; }

            try {
              setLoading(true);
              const response = await axios.post(`${API}/api/v1/user/google-login`, { idToken });
              const data = response?.data;
              localStorage.setItem("token", data?.data?.token);
              localStorage.setItem("user", JSON.stringify(data?.data?.user));
              toast.success("Google login successful ✅");
              window.location.href = "/";
            } catch (err: any) {
              toast.error(err?.response?.data?.message || "Google login failed ❌");
            } finally {
              setLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        initializedRef.current = true;
      }

      renderButton();
    };

    // ✅ ResizeObserver only re-renders the button, never re-initializes
    const observer = new ResizeObserver(() => renderButton());

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      script.onerror = () => toast.error("Failed to load Google login");
      document.body.appendChild(script);
    } else {
      initGoogle();
    }

    return () => {
      isMounted = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full mt-2">
      <div className="flex flex-col items-center gap-2">
        <div
          ref={buttonRef}
          className={`w-full transition ${loading ? "opacity-50 pointer-events-none" : ""}`}
        />
        {loading && (
          <span className="text-sm text-gray-500">Signing in with Google...</span>
        )}
      </div>
    </div>
  );
}