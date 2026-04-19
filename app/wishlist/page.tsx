"use client"

import ProductDisplay from "@/components/ProductDisplay";
import { API } from "@/service/dashboardService";
import axios from "axios";
import { useEffect, useState } from "react";

interface WishlistProduct {
  _id: string;
  name: string;
  imageUrl: string[];
  mrp: number;
  sellingPrice: number;
  quantity: number;
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function fetchWishlist(): Promise<WishlistProduct[]> {
  const token = getToken();
  if (!token) return [];

  const response = await axios.get(`${API}/api/v1/user/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data.products;
}

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist()
      .then(setWishlist)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400">
        Loading wishlist...
      </div>
    );
  }

  return (
    <div>
      {wishlist.length > 0 ? (
        <ProductDisplay
          title="My Wishlist"
          subtitle="Discover the magic of exquisite jewels that celebrate your special day with our endless love!"
          products={wishlist}
        />
      ) : (
        <div className="text-center py-16">
          <img
            src="/Images/item-not-found.webp"
            alt="No products"
            className="w-[220px] mx-auto mb-5 opacity-80"
          />
          <h3 className="text-xl mb-2">Product Not Found</h3>
          <p className="text-gray-500">
            No products are available right now.
          </p>
        </div>
      )}
    </div>
  );
}