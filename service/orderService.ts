import axios from "axios";
import { API } from "./dashboardService";

export const fetchOrderhistory = async (token: string) => {
  const res = await axios.get(`${API}/api/v1/user/orders/me`, {
    headers: {
      Authorization: `Bearer ${token}`, // pass token here
    },
  });

  return res.data;
};