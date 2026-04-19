"use client";

import { ProductCardProps } from "@/type/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAddToCart } from "@/hooks/useDashboard";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/service/dashboardService";


function getToken(): string | null {
  // adjust key to wherever you store the JWT
  return (
    localStorage.getItem("token") ??
    sessionStorage.getItem("token") ??
    null
  );
}

// localStorage key for guest wishlist
const GUEST_KEY = "guest_wishlist";

function getGuestWishlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function setGuestWishlist(ids: string[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(ids));
}

// ── API calls ─────────────────────────────────────────────────────────────────
async function fetchWishlist(): Promise<string[]> {
  const token = getToken();
  if (!token) return [];

  const res = await fetch(`${API}/api/v1/user/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  // extract just the product IDs
  return (json?.data?.products ?? []).map((p: { _id: string }) => p._id);
}

async function addToWishlistAPI(productId: string): Promise<void> {
  const token = getToken()!;
  await fetch(`${API}/api/v1/user/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
}

async function removeFromWishlistAPI(productId: string): Promise<void> {
  const token = getToken()!;
  await fetch(`${API}/api/v1/user/wishlist`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });
}

// ── component ─────────────────────────────────────────────────────────────────
export function ProductCard({
  title,
  price,
  image,
  id,
  productData,
}: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const queryClient = useQueryClient();
  const isLoggedIn = Boolean(getToken());

  // ── server wishlist (logged-in users) ──────────────────────────────────────
  const { data: serverWishlistIds = [] } = useQuery<string[]>({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });

  // ── guest wishlist (localStorage) ─────────────────────────────────────────
  const [guestIds, setGuestIds] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoggedIn) setGuestIds(getGuestWishlist());
  }, [isLoggedIn]);

  // derive whether THIS card is wishlisted
  const isWishlisted = isLoggedIn
    ? serverWishlistIds.includes(id)
    : guestIds.includes(id);

  // ── mutations ─────────────────────────────────────────────────────────────
  const { mutate: addWishlist, isPending: addingWishlist } = useMutation({
    mutationFn: () => addToWishlistAPI(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  const { mutate: removeWishlist, isPending: removingWishlist } = useMutation({
    mutationFn: () => removeFromWishlistAPI(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

  // ── heart click handler ───────────────────────────────────────────────────
  const handleWishlistToggle = () => {
    if (isLoggedIn) {
      isWishlisted ? removeWishlist() : addWishlist();
    } else {
      // guest: toggle in localStorage
      const current = getGuestWishlist();
      const updated = current.includes(id)
        ? current.filter((pid) => pid !== id)
        : [...current, id];
      setGuestWishlist(updated);
      setGuestIds(updated);
    }
  };

  const isHeartBusy = addingWishlist || removingWishlist;

  return (
    <Card className="w-72 rounded-xl overflow-hidden shadow-md">
      {/* Heart — top-right */}
      <div className="flex justify-end pr-[6px]">
        <button
          onClick={handleWishlistToggle}
          disabled={isHeartBusy}
          className="transition-transform duration-200 hover:scale-110 disabled:opacity-50"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? (
            <FaHeart size={22} className="text-red-600" />
          ) : (
            <FaRegHeart size={22} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Image */}
      <Link href={`/product/${id}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover cursor-pointer"
        />
      </Link>

      <div className="px-3 flex flex-col gap-3 pb-3">
        <span className="text-xl font-semibold">{title}</span>
        <hr className="border-black border" />

        <div className="flex items-center">
          <span className="text-xl font-bold">{price}</span>
          <Button
            onClick={() => addToCart({ productId: id, productData })}
            disabled={isPending}
            className="bg-red-800 ml-auto w-30 h-8"
          >
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Card>
  );
}