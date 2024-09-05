import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chip, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";
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
}

const QuizListComponent: FC<QuizListComponentProps> = (props) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "title", headerName: "Titre", width: 250 },
    { field: "description", headerName: "Description", width: 250 },
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
      field: "levelLabel",
      headerName: "Level",
      width: 100,
      renderCell: (value) => <Chip label={(value.row as Quiz).level} />,
    },
    {
      field: "themeLabel",
      headerName: "Theme",
      width: 100,
      renderCell: (value) => <Chip label={(value.row as Quiz).theme} />,
    },
  ];

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
