import { CustomOrderPayload } from "@/type/api";
import axios from "axios";
import { API } from "./dashboardService";


export const createCustomOrder = async (
  data: CustomOrderPayload & { token: string }
) => {
  const response = await axios.post(
    `${API}/api/v1/user/custom-order`,
    {
      type: data.type,
      date: data.date,
      address: data.address,
    },
    {
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    }
  );

  return response.data;
};

export const fetchCustomOrderhistory = async (token: string) => {
  const res = await axios.get(`${API}/api/v1/user/custom-order/me`, {
    headers: {
      Authorization: `Bearer ${token}`, // pass token here
    },
  });

  return res.data;
};