"use client";

import { fetchOrderhistory } from "@/service/orderService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export const useOrders = (token: string) => {
  return useQuery({
    queryKey: ["orders", token], 
    queryFn: () => fetchOrderhistory(token), 
    enabled: !!token, 
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};