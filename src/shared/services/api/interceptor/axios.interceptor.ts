import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { API_BASE_URL } from "../../../constants/api.constant";
import { ApiResponse } from "../../../types/ApiResponse";

export const http = axios.create({
  baseURL: API_BASE_URL,
});

// REQUEST INTERCEPTOR
http.interceptors.request.use(
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: InternalAxiosRequestConfig<any>
  ) => {
    if (config.url?.includes("login")) return config;
    else {
      const token = sessionStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    }
  },
  (err) => Promise.reject(err)
);

// RESPONSE INTERCEPTOR
http.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    err.message =
      err.response?.data.error != undefined
        ? err.response?.data.error
        : err.response?.data.message;

    if (err.code == "ERR_NETWORK" || err.code == "ERR_CONNECTION_REFUSED") {
      err.message = "Connexion au serveur impossible";
    } else if (err.response.status == 401) {
      err.message =
        (err as AxiosError<ApiResponse>).response?.data.error ?? "Accès refusé";
      sessionStorage.removeItem("accessToken");
      window.location.href = `/login`;
    } else if (err.response?.status === 403) {
      err.message =
        (err as AxiosError<ApiResponse>).response?.data.error ??
        "Action interdite";
    } else {
      const apiError = (err as AxiosError<ApiResponse>).response?.data.error;
      if (typeof apiError == "string") {
        err.message = apiError;
      }
    }
    enqueueSnackbar({ message: err.message, variant: "error", persist: true });
    return Promise.reject(err);
  }
);
