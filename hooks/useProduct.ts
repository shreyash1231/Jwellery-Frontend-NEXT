"use client";

import { fetchProductById } from "@/service/productService";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id, // only run when id exists
  });
};