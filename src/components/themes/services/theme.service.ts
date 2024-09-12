import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Paginated } from "../../../shared/types/Paginated";
import { Theme } from "../../../shared/types/Theme";

export const getAllThemes = (page: number, pageSize: number) => {
  return http.get<ApiResponse<Paginated<Theme>>>(
    `/admin/themes?page=${page}&pageSize=${pageSize}`
  );
};
