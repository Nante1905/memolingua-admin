import { JwtPayload, jwtDecode } from "jwt-decode";
import { http } from "../api/interceptor/axios.interceptor";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decodeJWT = (token: string | null): any => {
  if (token) {
    const decoded = jwtDecode(token);
    return decoded;
  }
  return null;
};

export const isTokenExpired = (decodedToken: JwtPayload) => {
  if (decodedToken != null) {
    const exp = decodedToken.exp as number;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  }
  return true;
};

export const requestAccessToken = (refreshToken: string) => {
  return http.post("/auth/refresh-token", {
    token: refreshToken,
  });
};

export const logOut = () => {
  sessionStorage.removeItem("accessToken");
};
