import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const findAllUsers = async (
  page: number,
  limit: number,
  search: string = "",
  sortField?: string,
  sortMode?: string
) =>
  http.get(
    `/admin/users?page=${page}&limit=${limit}&sortField=${sortField}&sortMode=${sortMode}&search=${search}`
  );

export const deleteUser = async (id: string) =>
  http.delete(`/admin/users/${id}`);
