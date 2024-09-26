import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { StatsDetails } from "../types/dashboard.type";

export const getDashboardDetails = (
  idLang: string,
  start?: string,
  end?: string
) => {
  let query = `/admin/stats/langs/${idLang}`;
  if (start) {
    query += `?start=${start}`;
  }
  if (end) {
    query += `${start ? "&" : "?"}end=${end}`;
  }
  return http.get<ApiResponse<StatsDetails>>(query);
};
