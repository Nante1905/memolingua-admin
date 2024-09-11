import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Card } from "../../../shared/types/Card";
import { Course } from "../../../shared/types/Course";
import { Media } from "../../../shared/types/Media";
import { Package } from "../../../shared/types/Package";
import { Paginated } from "../../../shared/types/Paginated";
import { Theme } from "../../../shared/types/Theme";
import { CardMedia } from "../types/CardMedia";
import { CreatePackageData } from "../types/CreatePackageData";
import { PackageContent, PackageLib } from "../types/PackageLib";

export const getCourses = () => {
  return http.get<ApiResponse<Course>>(`admin/langs/course`);
};

export const getDetailsPackage = (id: string) => {
  return http.get<ApiResponse<PackageContent>>(`admin/packages/${id}`);
};

export const getAllPackages = (
  page: { page: number; pageSize: number },
  filter?: { keyword?: string; author?: string; deleted?: boolean }
) => {
  let url = `/admin/packages?page=${page.page}&pageSize=${page.pageSize}`;
  if (filter) {
    if (filter.keyword) {
      if (filter.keyword.trim() != "") {
        url += `&keyword=${filter.keyword}`;
      }
    }
    if (filter.author) {
      url += `&author=${filter.author}`;
    }
    if (filter.deleted) {
      url += `&state=deleted`;
    }
  }
  return http.get<ApiResponse<Paginated<PackageLib>>>(url);
};

export const addCardsToPackage = (
  idPackage: string,
  cards: Partial<Card>[],
  medias: Partial<CardMedia>[]
) => {
  const data = cards.map((c, index) => {
    const media: Record<string, Media> = {};
    if (medias[index].img) {
      media.img = medias[index].img as Media;
    }
    if (medias[index].audio) {
      media.audio = medias[index].audio as Media;
    }
    if (medias[index].video) {
      media.video = medias[index].video as Media;
    }
    return { verso: c.verso, recto: c.recto, medias: media };
  });

  return http.post(`/admin/packages/${idPackage}/add-cards`, { cards: data });
};

export const getPackageById = (id: string) => {
  return http.get<ApiResponse<Partial<Package>>>(`/packages/${id}`);
};

export const getPackageDependances = () => {
  return http.get<ApiResponse<{ themes: Theme[]; courses: Course[] }>>(
    "/admin/packages/create/dependances"
  );
};

export const createPackage = (data: CreatePackageData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return http.post<ApiResponse<any>>("/admin/packages", { ...data });
};
