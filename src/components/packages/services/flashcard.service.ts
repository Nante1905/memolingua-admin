import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { Media } from "../../../shared/types/Media";

export const deleteCard = (id: string) => {
  return http.delete(`/admin/cards/${id}`);
};

export const updateCard = (data: {
  idCard: string;
  card: { medias: { img?: Media; video?: Media; audio?: Media } };
  removeImg?: boolean;
  removeAud?: boolean;
  removeVid?: boolean;
}) => {
  const { idCard, ...infos } = data;
  return http.put(`/admin/cards/${idCard}`, infos);
};
