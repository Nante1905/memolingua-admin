import { GridSortDirection } from "@mui/x-data-grid";

export interface LangListRootState {
  page: number;
  sort: string;
  order: GridSortDirection;
}

export const initialLangListState: LangListRootState = {
  page: 1,
  sort: "",
  order: "asc",
};
