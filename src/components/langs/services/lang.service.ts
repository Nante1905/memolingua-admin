import { GridSortDirection } from "@mui/x-data-grid";
import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { ImportValidationResult } from "../../../shared/types/ImportDTO";
import { Media } from "../../../shared/types/Media";
import { LangImportDTO } from "../types/LangImportDTO";

export const confirmCSVImportLang = () => {
  return http.get<ApiResponse<number>>(`/admin/langs/import/confirm`);
};

export const downloadCSVLang = () => {
  return http.get(`/admin/langs/import/download`, { responseType: "blob" });
};

export const importLangCSV = (data: { file: Media }) => {
  return http.post<ApiResponse<ImportValidationResult<LangImportDTO>>>(
    `/admin/langs/import`,
    {
      ...data,
    }
  );
};

export const getAllLangs = (
  page: number,
  limit: number,
  filter?: { keyword?: string; sort?: string; order?: GridSortDirection }
) => {
  let query = `/admin/langs?page=${page}&limit=${limit}`;
  if (filter) {
    if (filter.keyword) {
      query += `&keyword=${filter.keyword.trim()}`;
    }
    if (filter.sort) {
      query += `&sort=${filter.sort.trim()}&order=${filter.order
        ?.trim()
        .toUpperCase()}`;
    }
  }
  return http.get(query);
};

export const createLang = (data: object) => http.post("/admin/langs", data);
export const updateLang = (values: { data: object; id: string }) =>
  http.put(`/admin/langs/${values.id}`, values.data);

export const findLangById = (id: string) => http.get(`admin/langs/${id}`);
