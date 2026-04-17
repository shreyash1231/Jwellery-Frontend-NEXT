"use client";

export default function AnnouncementBar() {
  const announcementText =
    "Get 5% off on your 1st order, after you subscribe with us | WE SUGGEST - FOR FAMILY WEDDINGS, BRIDESMAID OR BESTMAN GIFTING, CUSTOM ORDERS, CONTACT US DIRECTLY";

  return (
    <div className="w-full h-[36px] bg-[#2a2016] border-b border-white/10 overflow-hidden flex items-center">
      
      <div className="flex animate-loop whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-[12px] tracking-[0.08em] font-semibold text-[#f4e8dc] uppercase pr-10"
          >
            {announcementText}
          </span>
        ))}
      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-loop {
          min-width: 200%;
          display: flex;
          animation: loop 18s linear infinite;
        }

        @keyframes loop {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .animate-loop {
            animation-duration: 16s;
          }
        }
      `}</style>
    </div>
  );
}