import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { CardWithMedia } from "../../../shared/types/Card";
import { Course } from "../../../shared/types/Course";
import { Media } from "../../../shared/types/Media";
import { Package } from "../../../shared/types/Package";
import { Paginated } from "../../../shared/types/Paginated";
import { Theme } from "../../../shared/types/Theme";
import { CreatePackageData } from "../types/CreatePackageData";
import { PackageContent, PackageLib } from "../types/PackageLib";

export const deletePackage = (id: string) => {
  return http.delete<ApiResponse>(`/admin/packages/${id}`);
};

export const updatePackage = (data: {
  id: string;
  title: string;
  img?: Media;
  removeImg?: boolean;
}) => {
  return http.put(`/admin/packages/${data.id}`, {
    title: data.title,
    img: data.img,
    removeImg: data.removeImg,
  });
};

export const getPackageById = (id: string) => {
  return http.get<ApiResponse<Package>>(`admin/packages/${id}`);
};

export const getCourses = () => {
  return http.get<ApiResponse<Course>>(`admin/langs/course`);
};

export const getDetailsPackage = (id: string) => {
  return http.get<ApiResponse<PackageContent>>(`admin/packages/${id}?type=lib`);
};

export const getAllPackages = (
  page: { page: number; pageSize: number },
  filter?: {
    keyword?: string;
    author?: string;
    notDeleted?: boolean;
    sort?: string;
    order?: string;
  }
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
    if (filter.notDeleted) {
      url += `&state=exist`;
    }
    if (filter.sort) {
      url += `&sort=${filter.sort.trim()}&order=${filter.order
        ?.trim()
        .toUpperCase()}`;
    }
  }
  return http.get<ApiResponse<Paginated<PackageLib>>>(url);
};

export const addCardsToPackage = (
  idPackage: string,
  cards: Partial<CardWithMedia>[]
) => {
  // console.log(cards);

  const data = cards.map((c) => {
    return {
      verso: c.verso,
      recto: c.recto,
      medias: {
        img: c.medias?.img?.media,
        audio: c.medias?.audio?.media,
        video: c.medias?.video?.media,
      },
    };
  });
  console.log(data);

  return http.post(`/admin/packages/${idPackage}/add-cards`, { cards: data });
};

export const getDetailsPackageById = (id: string) => {
  return http.get<ApiResponse<Partial<Package>>>(
    `/admin/packages/${id}?type=lib`
  );
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
