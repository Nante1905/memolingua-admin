import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Card } from "../../../shared/types/Card";
import { Langage } from "../../../shared/types/Langage";
import { Media } from "../../../shared/types/Media";
import { Package } from "../../../shared/types/Package";
import { Theme } from "../../../shared/types/Theme";
import { CardMedia } from "../types/CardMedia";
import { CreatePackageData } from "../types/CreatePackageData";

export const addCardsToPackage = (
  idPackage: string,
  cards: Partial<Card>[],
  medias: Partial<CardMedia>[]
) => {
  const data = cards.map((c, index) => {
    const media: Record<string, Media> = {};
    if (medias[index].img) {
      media.img = medias[index].img;
    }
    if (medias[index].audio) {
      media.audio = medias[index].audio;
    }
    if (medias[index].video) {
      media.video = medias[index].video;
    }
    return { verso: c.verso, recto: c.recto, medias: media };
  });

  return http.post(`/admin/packages/${idPackage}/add-cards`, { cards: data });
};

export const getPackageById = (id: string) => {
  return http.get<ApiResponse<Partial<Package>>>(`/packages/${id}`);
};

export const getPackageDependances = () => {
  return http.get<ApiResponse<{ themes: Theme[]; langages: Langage[] }>>(
    "/admin/packages/create/dependances"
  );
};

export const createPackage = (data: CreatePackageData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return http.post<ApiResponse<any>>("/admin/packages", { ...data });
};
