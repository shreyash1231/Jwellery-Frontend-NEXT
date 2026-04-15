"use client";

import { createCustomOrder, fetchCustomOrderhistory } from "@/service/customOrderService";
import { CustomOrderPayload } from "@/type/api";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useCustomOrder = () => {
  return useMutation({
    mutationFn: (data: CustomOrderPayload & { token: string }) =>
      createCustomOrder(data),
  });
};

export const useCustomOrders = (token: string) => {
  return useQuery({
    queryKey: ["Customorders", token], 
    queryFn: () => fetchCustomOrderhistory(token), 
    enabled: !!token, 
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 2,
  });
};