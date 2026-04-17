import axios from "axios";
import { API } from "./dashboardService";
import { RegisterPayload, RegisterResponse } from "@/type/api";

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


export const registerUser = async (
  data: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await axios.post<RegisterResponse>(
    `${API}/api/v1/user/register`,
    data
  );
  // response.data is the full API response: { token, message, ... }
  return response.data;
};