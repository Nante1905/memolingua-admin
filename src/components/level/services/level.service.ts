import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const createLevel = (data: object) => http.post("/admin/levels", data);
export const updateLevel = (id: string, data: object) =>
  http.put(`/admin/levels/${id}`, data);
export const getLevelById = (id: string) => http.get(`/admin/levels/${id}`);
export const deleteLevel = (id: string) => http.delete(`/admin/levels/${id}`);
