import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";
import { Link } from "react-router-dom";
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
      field: "state",
      headerName: "État",
      width: 120,
    },
    {
      field: "idQuiz",
      headerName: "Quiz",
      width: 120,
    },

    {
      field: "img",
      headerName: "Image",
      width: 250,
      //   valueGetter: (value: QuizQuestionMedia) => value?.mediaPath,
      renderCell: (params) =>
        params.row.img && (
          <Link to={API_BASE_URL + params.row.img?.mediaPath}></Link>
        ),
    },
    {
      field: "vid",
      headerName: "Video",
      width: 250,
      //   valueGetter: (value: QuizQuestionMedia) => value?.mediaPath,
      renderCell: (params) =>
        params.row.vid && (
          <Link to={API_BASE_URL + params.row.vid?.mediaPath}>VOIR</Link>
        ),
    },
  ];

  return (
    <div className="question-list_container">
      <div className="data-table">
        <AppLoaderComponent loading={false}>
          <DataGrid
            localeText={{
              noRowsLabel: "Aucune donnée",
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
