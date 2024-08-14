import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Langage } from "../../../shared/types/Langage";
import { Theme } from "../../../shared/types/Theme";
import { CreatePackageData } from "../types/CreatePackageData";

export const getPackageDependances = () => {
  return http.get<ApiResponse<{ themes: Theme[]; langages: Langage[] }>>(
    "/admin/packages/create/dependances"
  );
};

export const createPackage = (data: CreatePackageData) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return http.post<ApiResponse<any>>("/admin/packages", { ...data });
};
