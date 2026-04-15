"use client";

import { addQuery } from "@/service/contactService";
import { ContactPayload } from "@/type/api";
import { useMutation } from "@tanstack/react-query";


export const useContact = () => {
  return useMutation({
    mutationFn: (data: ContactPayload) => addQuery(data),
  });
};
