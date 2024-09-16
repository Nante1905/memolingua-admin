import { GridSortDirection } from "@mui/x-data-grid";

export interface PackageListState {
  page: number;
  authorFilter: string;
  isNotDeleted: boolean;
  sort: string;
  order: GridSortDirection;

  package?: {
    id: string;
    title: string;
  };
}

export const initialPackageListState: PackageListState = {
  page: 1,
  authorFilter: "all",
  isNotDeleted: false,
  sort: "",
  order: "asc",
};
