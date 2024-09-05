import axios, { InternalAxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";
import { API_BASE_URL } from "../../../constants/api.constant";

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

    if (err.code == "ERR_NETWORK") {
      err.message = "Connexion au serveur impossible";
    } else if (err.response.status == 401) {
      enqueueSnackbar({ message: "Unauthorized", variant: "error" });
    } else {
      if (!err.message) {
        err.message = "Une erreur s'est produite";
      }
    }
    return Promise.reject(err);
  }
);
