export interface PackageListState {
  page: number;
  authorFilter: string;
  deleteFilter: boolean;
  package?: {
    id: string;
    title: string;
  };
}

export const initialPackageListState: PackageListState = {
  page: 1,
  authorFilter: "all",
  deleteFilter: false,
};
