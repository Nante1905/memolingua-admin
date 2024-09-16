import { GridSortDirection } from "@mui/x-data-grid";
import { http } from "../../../shared/services/api/interceptor/axios.interceptor";
import { ApiResponse } from "../../../shared/types/ApiResponse";
import { Langage } from "../../../shared/types/Langage";
import { Paginated } from "../../../shared/types/Paginated";
import {
  MultiLabelTheme,
  Theme,
  ThemeLabel,
} from "../../../shared/types/Theme";

export const deleteTheme = (id: string) => http.delete(`/admin/themes/${id}`);

export const updateTheme = (data: {
  id: string;
  form: {
    label: string;
    icon: string;
    langs: { label: string; id: string }[];
  };
}) => {
  return http.put(`/admin/themes/${data.id}`, data.form);
};

export const getThemeById = (id: string) => {
  return http.get<ApiResponse<MultiLabelTheme>>(`/admin/themes/${id}`);
};

export const getLangsForTheme = () => {
  return http.get<ApiResponse<ThemeLabel[]>>(`/langs?except=fr`);
};

export const getExistLangs = () => {
  return http.get<ApiResponse<Langage[]>>(`/langs`);
};

export const createTheme = (data: {
  label: string;
  icon: string;
  langs: { label: string; id: string }[];
}) => {
  return http.post(`/admin/themes`, data);
};

export const getAllThemes = (
  page: number,
  pageSize: number,
  filter: {
    isNotDeleted: boolean;
    keyword: string;
    order?: GridSortDirection;
    sort?: string;
  } = {
    isNotDeleted: false,
    keyword: "",
    order: "asc",
    sort: undefined,
  }
) => {
  let req = `/admin/themes?page=${page}&pageSize=${pageSize}`;
  if (filter.isNotDeleted) {
    req += `&state=exist`;
  }
  if (filter.keyword != "") {
    req += `&keyword=${filter.keyword.trim()}`;
  }
  if (filter.sort) {
    req += `&sort=${filter.sort.trim()}&order=${filter.order
      ?.trim()
      .toUpperCase()}`;
  }
  return http.get<ApiResponse<Paginated<Theme>>>(req);
};