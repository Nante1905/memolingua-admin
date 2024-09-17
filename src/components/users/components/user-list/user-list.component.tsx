import {
  DataGrid,
  GridColDef,
  GridSortItem,
  GridSortModel,
} from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";

import { Delete } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/material";
import { blue, pink } from "@mui/material/colors";
import { FC, useState } from "react";
import EntityChipStateComponent from "../../../../shared/components/entity-chip-state/entity-chip-state.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { ADMIN_ROLE } from "../../../../shared/constants/api.constant";
import { APP_GENDER } from "../../../../shared/constants/gender.constant";
import { formatDate } from "../../../../shared/helpers/formatter";
import { Paginated } from "../../../../shared/types/Paginated";
import { User } from "../../../../shared/types/User";
import "./user-list.component.scss";

interface UserListComponentProps {
  loading: boolean;
  users: Paginated<User>;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (model: GridSortItem) => void;
  onDeleteClick: (id: string) => void;
}

const UserListComponent: FC<UserListComponentProps> = (props) => {
  const [sortModel, setSortModel] = useState<GridSortModel>();

  const columns: GridColDef[] = [
    {
      headerName: "ID",
      field: "id",
    },
    {
      headerName: "Prénom",
      field: "firstname",
      width: 170,
    },
    {
      headerName: "Nom",
      field: "lastname",
      width: 170,
    },
    {
      headerName: "Genre",
      field: "gender",
      width: 170,
      renderCell: (params) =>
        params.row.gender && (
          <Chip
            label={APP_GENDER[params.row.gender]}
            sx={{
              backgroundColor: params.row.gender == 0 ? pink[100] : blue[100],
            }}
            size="small"
          />
        ),
    },
    {
      headerName: "Date de naissance",
      field: "birthday",
      width: 170,
      valueFormatter: (value) => value && formatDate(new Date(value)),
    },
    {
      headerName: "Date d'inscription",
      field: "signupDate",
      width: 170,
      valueFormatter: (value) => value && formatDate(new Date(value)),
    },
    {
      headerName: "Email",
      field: "email",
      width: 170,
    },
    {
      field: "state",
      headerName: "État",
      width: 100,
      display: "flex",
      renderCell: (value) => (
        <EntityChipStateComponent entityState={value.row.state} />
      ),
    },
    {
      headerName: "Role",
      field: "role",
      width: 70,
      renderCell: (params) => (
        <Chip
          label={params.row.role.code}
          color={params.row.role.code == ADMIN_ROLE ? "secondary" : "accent"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <div className="actions">
          <IconButton
            onClick={() => {
              props.onDeleteClick((params.row as User).id);
            }}
          >
            <Delete color="error" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="user-list">
      <div className="data-table">
        <AppLoaderComponent loading={false}>
          <DataGrid
            localeText={{
              noRowsLabel: "Aucune donnée",
              ...frFR.components.MuiDataGrid.defaultProps.localeText,
            }}
            columns={columns}
            rows={props.users?.items}
            loading={props.loading}
            hideFooterPagination={true}
            autoHeight={true}
            sortingMode="server"
            sortModel={sortModel}
            onSortModelChange={(model) => {
              setSortModel(model);
              props.onSortChange(model[0]);
            }}
            disableColumnFilter
          />
        </AppLoaderComponent>
        <AppPagination
          currentPage={props.users?.page ?? 1}
          pageSize={props.users?.itemPerPage ?? props.pageSize}
          totalPage={props.users?.totalPage}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default UserListComponent;
