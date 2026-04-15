import axios from "axios";
import { API } from "./dashboardService";
import { ContactPayload } from "@/type/api";

export const addQuery = async (data: ContactPayload) => {
  const response = await axios.post(
    `${API}/api/v1/user/add-query`,
    data
  );
  return response.data;
};