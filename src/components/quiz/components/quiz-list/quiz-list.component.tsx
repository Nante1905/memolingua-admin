import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterItem,
  GridSortItem,
  GridSortModel,
} from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import parse from "html-react-parser";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { formatDate } from "../../../../shared/helpers/formatter";
import { Paginated } from "../../../../shared/types/Paginated";
import { Quiz } from "../../../../shared/types/Quiz";
import "./quiz-list.component.scss";

interface QuizListComponentProps {
  quizs: Paginated<Quiz>;
  quizsLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: GridSortItem) => void;
  onFilterChange: (filter: GridFilterItem) => void;
  onDeleteClick: (id: string) => void;
}

const QuizListComponent: FC<QuizListComponentProps> = (props) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "title", headerName: "Titre", width: 250 },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      sortable: false,

      renderCell: (param) => <div>{parse(param.row.description)}</div>,
    },
    {
      field: "creationDate",
      headerName: "Date Création",
      width: 120,
      valueFormatter: (value) => formatDate(new Date(value)),
    },
    {
      field: "state",
      headerName: "État",
      width: 100,
    },
    {
      field: "languageSource",
      headerName: "Language source",
      width: 100,
    },
    {
      field: "languageTarget",
      headerName: "Language du cours",
      width: 100,
    },
    {
      field: "level",
      headerName: "Level",
      width: 100,
      renderCell: (value) => <Chip label={(value.row as Quiz).level} />,
    },
    {
      field: "theme",
      headerName: "Theme",
      width: 100,
      renderCell: (value) => <Chip label={(value.row as Quiz).theme} />,
      valueGetter: (_, row) => row.theme,
    },
    {
      field: "",
      headerName: "Actions",
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (value) => (
        <div className="actions">
          <Link to={`/questions?id=${(value.row as Quiz).id}`}>
            <Button variant="contained" color="secondary">
              Questions
            </Button>
          </Link>
          <Link to={`/quizs/${(value.row as Quiz).id}/update`}>
            <IconButton>
              <Edit />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => {
              props.onDeleteClick((value.row as Quiz).id);
            }}
          >
            <Delete color="error" />
          </IconButton>
        </div>
      ),
    },
  ];

  const [sortModel, setSortModel] = useState<GridSortModel>();

  return (
    <div className="quiz-list">
      <div className="search-bar">
        <TextField
          label="Mots clés"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon
                  icon={"fa-solid fa-magnifying-glass" as IconProp}
                />
              </InputAdornment>
            ),
          }}
          onChange={(e) => props.onSearchChange(e.target.value as string)}
        />
      </div>
      <div className="data-table">
        <AppLoaderComponent loading={props.quizsLoading}>
          <DataGrid
            columns={columns}
            rows={props.quizs?.items}
            loading={props.quizsLoading}
            hideFooterPagination={true}
            sortingMode="server"
            localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
            sortModel={sortModel}
            onSortModelChange={(model) => {
              setSortModel(model);
              props.onSortChange(model[0]);
            }}
            sx={{
              "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                py: "8px",
              },
              "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                py: "15px",
              },
              "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                py: "22px",
              },
            }}
            getRowHeight={() => "auto"}
            filterDebounceMs={500}
            autoHeight
          />
        </AppLoaderComponent>
        <AppPagination
          currentPage={props.page}
          pageSize={props.quizs?.itemPerPage}
          totalPage={props.quizs?.totalPage}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default QuizListComponent;
