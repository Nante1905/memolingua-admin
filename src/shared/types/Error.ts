import { AxiosError } from "axios";
import { ApiResponse } from "./ApiResponse";

export type AppReponseError<T> = AxiosError<ApiResponse<T>>;
