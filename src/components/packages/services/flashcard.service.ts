import { http } from "../../../shared/services/api/interceptor/axios.interceptor";

export const deleteCard = (id: string) => {
  return http.delete(`/admin/cards/${id}`);
};
