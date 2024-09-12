import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const createLang = (data: object) => http.post("/admin/langs", data);
export const updateLang = (values: { data: object; id: string }) =>
  http.put(`/admin/langs/${values.id}`, values.data);

export const findLangById = (id: string) => http.get(`admin/langs/${id}`);
