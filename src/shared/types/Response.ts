import { AxiosResponse } from "axios";
import { ApiResponse } from "./ApiResponse";

export type AppResponse<T> = AxiosResponse<ApiResponse<T>>;
