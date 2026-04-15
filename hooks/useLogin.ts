"use client";

import { loginUser } from "@/service/authService";
import { useMutation } from "@tanstack/react-query";


export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};