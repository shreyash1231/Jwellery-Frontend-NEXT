"use client";

import { loginUser, registerUser } from "@/service/authService";
import { RegisterPayload, RegisterResponse } from "@/type/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useRegister = (onSuccessCallback?: () => void) => {
  return useMutation<RegisterResponse, any, RegisterPayload>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      // data is already response.data (unwrapped by axios in registerUser)
      // so token is at data.token NOT data.data.token
      const token = data?.data.token;

      if (token) {
        localStorage.setItem("otptoken", token);
      }

      toast.success(data?.message || "OTP sent successfully!");
      onSuccessCallback?.();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    },
  });
};