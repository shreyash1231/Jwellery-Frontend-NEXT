import axios from "axios";
import { API } from "./dashboardService";


export const fetchProductById = async (id: string) => {
  const response = await axios.get(`${API}/api/v1/user/get-product-by-id/${id}`);
  return response.data.data;
};