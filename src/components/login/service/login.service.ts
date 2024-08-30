import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const logIn = (data: { email: string; pwd: string }) => {
  return http.post("/login/admin", data);
};
