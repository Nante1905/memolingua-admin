import { GridSortDirection } from "@mui/x-data-grid";
import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

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
