import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, Close, Edit } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { FC } from "react";
import { Link } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { Paginated } from "../../../../shared/types/Paginated";
import { QuizAnswer } from "../../../../shared/types/QuizAnswer";
import "./answer-list.component.scss";

interface AnswerListComponentProps {
  answers: Paginated<QuizAnswer>;
  answersLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
}

const AnswerListComponent: FC<AnswerListComponentProps> = (props) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 120,
    },
    {
      field: "answer",
      headerName: "Réponse",
      width: 300,
    },
    {
      field: "isCorrect",
      headerName: "Est correct",
      width: 120,
      display: "flex",
      renderCell: (params) =>
        params.row.isCorrect ? (
          <Check color="primary" />
        ) : (
          <Close color="error" />
        ),
    },
    {
      field: "idQuestion",
      headerName: "Question",
      width: 120,
    },
    {
      field: "actions",
      headerName: "",
      width: 140,
      display: "flex",
      //   valueGetter: (value: QuizQuestionMedia) => value?.mediaPath,
      renderCell: (params) => (
        <div className="actions">
          <Link to={`/answers/${params.row.id}/update`}>
            <IconButton>
              <Edit />
            </IconButton>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="answer-list_container">
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
        <AppLoaderComponent loading={false}>
          <DataGrid
            localeText={{
              noRowsLabel: "Aucune donnée",
              ...frFR.components.MuiDataGrid.defaultProps.localeText,
            }}
            columns={columns}
            rows={props.answers?.items}
            loading={props.answersLoading}
            hideFooterPagination={true}
            autoHeight={true}
          />
        </AppLoaderComponent>
        <AppPagination
          currentPage={props.page}
          pageSize={props.answers?.itemPerPage}
          totalPage={props.answers?.totalPage}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default AnswerListComponent;
