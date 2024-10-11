import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { ImportValidationResult } from "../../../shared/types/ImportDTO";
import { Media } from "../../../shared/types/Media";
import { CardImportDTO } from "../types/PackageImportDTO";

export const confirmCSVImportCard = () => {
  return http.get<ApiResponse<number>>(`/admin/cards/import/confirm`);
};

export const downloadCSVCard = () => {
  return http.get(`/admin/cards/import/download`, { responseType: "blob" });
};

export const importCardCSV = (data: { file: Media }) => {
  return http.post<ApiResponse<ImportValidationResult<CardImportDTO>>>(
    `/admin/cards/import`,
    {
      ...data,
    }
  );
};

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
