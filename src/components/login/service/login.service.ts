import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const logIn = (data: { email: string; pwd: string }) => {
  return http.post("/admin/login", data);
};
