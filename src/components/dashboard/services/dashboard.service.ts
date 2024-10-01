import dayjs from "dayjs";
import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { GeneralStatsData, StatsDetails } from "../types/dashboard.type";

export const findGeneralDashboardData = (
  startDate: string,
  endDate: string
) => {
  const now = dayjs();
  const midnight = now.add(1, "day").set("hour", 0).set("minutes", 0);
  return http.get<ApiResponse<GeneralStatsData>>(
    `/admin/stats?start=${startDate}&end=${endDate}`,
    {
      cache: {
        ttl: midnight.diff(now, "millisecond"),
      },
    }
  );
};

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
  const now = dayjs();
  const midnight = now.add(1, "day").set("hour", 0).set("minutes", 0);
  return http.get<ApiResponse<StatsDetails>>(query, {
    cache: {
      ttl: midnight.diff(now, "millisecond"),
    },
  });
};
