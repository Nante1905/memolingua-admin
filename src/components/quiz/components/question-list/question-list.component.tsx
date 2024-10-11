import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, Close, Delete, Edit } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import { FC } from "react";
import { Link } from "react-router-dom";
import EntityChipStateComponent from "../../../../shared/components/entity-chip-state/entity-chip-state.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { API_BASE_URL } from "../../../../shared/constants/api.constant";
import { Paginated } from "../../../../shared/types/Paginated";
import { QuizQuestion } from "../../../../shared/types/QuizQuestion";
import "./question-list.component.scss";

interface QuestionListComponentProps {
  questions: Paginated<QuizQuestion>;
  questionsLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onDeleteClick: (id: string) => void;
}

const QuestionListComponent: FC<QuestionListComponentProps> = (props) => {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 120,
    },
    {
      field: "question",
      headerName: "Question",
      width: 300,
    },
    {
      field: "isQcm",
      headerName: "Est un QCM",
      width: 100,
      cellClassName: "qcm-cell",
      renderCell: (params) => {
        return params.row.isQcm ? (
          <Check color="primary" />
        ) : (
          <Close color="error" />
        );
      },
    },
    {
      field: "state",
      headerName: "État",
      width: 120,
      renderCell: (params) => (
        <EntityChipStateComponent entityState={params.row.state} />
      ),
    },
    {
      field: "idQuiz",
      headerName: "Quiz",
      width: 120,
    },

    {
      field: "img",
      headerName: "Image",
      width: 100,
      //   valueGetter: (value: QuizQuestionMedia) => value?.mediaPath,
      renderCell: (params) =>
        params.row.img && (
          <Link to={API_BASE_URL + params.row.img?.mediaPath} target="_blank">
            VOIR
          </Link>
        ),
    },
    {
      field: "vid",
      headerName: "Video",
      width: 100,
      //   valueGetter: (value: QuizQuestionMedia) => value?.mediaPath,
      renderCell: (params) =>
        params.row.vid && (
          <Link to={API_BASE_URL + params.row.vid?.mediaPath} target="_blank">
            VOIR
          </Link>
        ),
    },
    {
      field: "actions",
      headerName: "",
      width: 140,
      //   valueGetter: (value: QuizQuestionMedia) => value?.mediaPath,
      renderCell: (params) => (
        <div className="actions">
          <Link to={`/questions/${params.row.id}/update`}>
            <IconButton>
              <Edit />
            </IconButton>
          </Link>
          <IconButton
            onClick={() => {
              props.onDeleteClick((params.row as QuizQuestion).id);
            }}
          >
            <Delete color="error" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="question-list_container">
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
            rows={props.questions?.items.map((e) => ({
              ...e,
              img: e.medias.find((m) => m.mediaType === "IMG"),
              vid: e.medias.find((m) => m.mediaType === "VID"),
            }))}
            loading={props.questionsLoading}
            hideFooterPagination={true}
            autoHeight={true}
          />
        </AppLoaderComponent>
        <AppPagination
          currentPage={props.page}
          pageSize={props.questions?.itemPerPage}
          totalPage={props.questions?.totalPage}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default QuestionListComponent;
