"use client";

import { ProductCardProps } from "@/type/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

export function ProductCard({
  title,
  price,
  image,
  id,
  productData,
}: ProductCardProps) {

  const handleAddToCart = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/cart/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      }
    );
  } else {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existing = cart.find((item: any) => item._id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...productData,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

  return (
    <Card className="w-72 rounded-xl overflow-hidden shadow-md">
      
      {/* Image */}
      <Link href={`/product/${id}`}>
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover cursor-pointer"
        />
      </Link>

      <div className="px-3 flex flex-col gap-3">
        <span className="text-xl font-semibold">{title}</span>
        <hr className="border-black border" />

        <div className="flex items-center">
          <span className="text-xl font-bold">{price}</span>

          <Button
            onClick={handleAddToCart}
            className="bg-red-800 ml-auto w-30 h-8"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}