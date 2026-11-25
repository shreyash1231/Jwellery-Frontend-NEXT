"use client";

import { usePrivacyPolicy } from "@/hooks/useDashboard";


export default function ShippingPolicyDocs() {
  const { data, isLoading, error } = usePrivacyPolicy();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center arial-font">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 arial-font">
        {(error as Error).message}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center arial-font">
        No Shipping Policy Found
      </div>
    );
  }

 return (
  <div className="min-h-screen bg-[#f5f5f5] py-6 px-3 arial-font">
        {/* Title */}
    <h1 className="text-center text-2xl font-bold tracking-wider mb-1">
      PRIVACY POLICY
    </h1>
  <div className="max-w-2xl mx-auto bg-white p-4 shadow-sm">

    {/* Content */}
<div
  className="text-[16px] leading-snug text-gray-800
             
             [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2
             [&_h2[data-h1]]:text-xl
             [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-2
             [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-1
             
             [&_p]:mb-1
             [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-1
             [&_li]:mb-[1px]"
  dangerouslySetInnerHTML={{ __html: String(data.content || "").replace(/<h1\b/gi, "<h2 data-h1").replace(/<\/h1>/gi, "</h2>") }}
/>
  </div>
</div>
);
}