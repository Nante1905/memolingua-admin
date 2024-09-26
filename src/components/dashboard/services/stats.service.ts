import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { GeneralStatsData } from "../types/stats.types";

export const findGeneralDashboardData = (startDate: string, endDate: string) =>
  http.get<ApiResponse<GeneralStatsData>>(
    `/admin/stats?start=${startDate}&end=${endDate}`
  );
