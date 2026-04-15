import axios from "axios";
import { API } from "./dashboardService";

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.post(
    `${API}/api/v1/user/login`,
    data
  );
  return response.data;
};