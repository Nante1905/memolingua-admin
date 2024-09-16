import { GridSortDirection } from "@mui/x-data-grid";

export interface ThemeListState {
  page: number;
  isNotDeleted: boolean;
  sort: string;
  order: GridSortDirection;
}

export const initialThemeListState: ThemeListState = {
  page: 1,
  isNotDeleted: false,
  sort: "id",
  order: "asc",
};
