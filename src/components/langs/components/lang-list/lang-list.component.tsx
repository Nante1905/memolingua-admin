import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";
import { Link } from "react-router-dom";
import EntityChipStateComponent from "../../../../shared/components/entity-chip-state/entity-chip-state.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { Langage } from "../../../../shared/types/Langage";
import { Paginated } from "../../../../shared/types/Paginated";

interface LangListComponentProps {
  langs: Paginated<Langage>;
  langsLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const LangListComponent: FC<LangListComponentProps> = (props) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "label", headerName: "Label", width: 250 },
    { field: "code", headerName: "Code", width: 250 },
    {
      field: "state",
      headerName: "État",
      width: 100,
      renderCell: (params) => (
        <EntityChipStateComponent entityState={params.row.state} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
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
        <AppLoaderComponent loading={props.langsLoading}>
          <DataGrid
            columns={columns}
            rows={props.langs?.items}
            loading={props.langsLoading}
            hideFooterPagination={true}
          />
        </AppLoaderComponent>
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
