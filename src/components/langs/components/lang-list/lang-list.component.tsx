import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales/frFR";
import { FC } from "react";
import { Link } from "react-router-dom";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { getFlagLinkFromCompleteCode } from "../../../../shared/services/api/flags/flag-api.service";
import { Langage } from "../../../../shared/types/Langage";
import { Paginated } from "../../../../shared/types/Paginated";
import "./lang-list.component.scss";

interface LangListComponentProps {
  langs: Paginated<Langage>;
  langsLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortModelChange: (model: GridSortModel) => void;
}

const LangListComponent: FC<LangListComponentProps> = (props) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "label", headerName: "Label", width: 250 },
    {
      field: "code",
      headerName: "Code",
      headerAlign: "center",
      width: 120,
      renderCell: (value) => (
        <div className="inline-flex flag-code">
          {value.row.code}{" "}
          <img
            src={getFlagLinkFromCompleteCode(value.row.code, 24)}
            alt={value.row.code}
          />{" "}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 100,
      sortable: false,
      renderCell: (value) => (
        <Link to={`/langs/${value.row.id}/update`}>
          <IconButton>
            {" "}
            <Edit />{" "}
          </IconButton>
        </Link>
      ),
    },
  ];

  return (
    <div className="lang-list">
      <div className="data-table">
        {/* <AppLoaderComponent loading={props.langsLoading}> */}
        <DataGrid
          columns={columns}
          rows={props.langs?.items}
          loading={props.langsLoading}
          hideFooterPagination={true}
          localeText={{
            noRowsLabel: "Aucune donnée",
            ...frFR.components.MuiDataGrid.defaultProps.localeText,
          }}
          disableColumnFilter
          filterMode="server"
          onSortModelChange={props.onSortModelChange}
          autoHeight
        />
        {/* </AppLoaderComponent> */}
        <AppPagination
          currentPage={props.page}
          pageSize={props.langs?.itemPerPage}
          totalPage={props.langs?.totalPage}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default LangListComponent;
