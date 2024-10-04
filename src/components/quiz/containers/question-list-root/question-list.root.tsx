import { UploadFile } from "@mui/icons-material";
import { Button, MenuItem } from "@mui/material";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import SelectInputControlledComponent from "../../../../shared/components/inputs/select-input/select-input-controlled.component";
import { AppReponseError } from "../../../../shared/types/Error";
import { Quiz } from "../../../../shared/types/Quiz";
import { AppResponse } from "../../../../shared/types/Response";
import QuestionListComponent from "../../components/question-list/question-list.component";
import {
  deleteQuestion,
  findAllQuestions,
  findAllQuizsSelect,
} from "../../services/quiz.service";
import "./question-list.root.scss";

interface QuestionListRootState {
  page: number;
  quizPage: number;
  pageSize?: number;
  search?: string;
  idQuiz?: string;
  openDialog: boolean;
  idDelete: string;
}

const QuestionListRoot = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<QuestionListRootState>({
    page: 1,
    quizPage: 1,
    idQuiz: searchParams.get("id") ?? "",
    openDialog: false,
    idDelete: "",
  });

  const queryClient = useQueryClient();

  const [pageSize, setPageSize] = useDebounceValue(8, 800);

  const questionQuery = useQuery({
    queryKey: ["quiz/question", state.page, pageSize, state.idQuiz],
    queryFn: () => findAllQuestions(state.page, pageSize, state.idQuiz),
  });
  const quizQuery = useInfiniteQuery({
    queryKey: ["quiz/all"],
    initialPageParam: 1,
    queryFn: findAllQuizsSelect,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.payload.page;
      if (lastPage.data.payload.totalPage > currentPage) return currentPage + 1;
      else return undefined;
    },
  });

  const questionDeleteMutation = useMutation({
    mutationKey: ["question/delete"],
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: (res: AppResponse<unknown>) => {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["quiz/question"] });
      closeDialog();
    },
    onError: (err: AppReponseError<unknown>) => {
      enqueueSnackbar({
        message: err.response?.data.error ?? err.message,
        variant: "error",
      });
    },
  });

  const onDelete = useCallback(
    (id: string) => {
      questionDeleteMutation.mutate(id);
    },
    [questionDeleteMutation]
  );

  const closeDialog = useCallback(() => {
    setState((state) => ({ ...state, openDialog: false, idDelete: "" }));
  }, [setState]);

  const onDeleteClick = useCallback(
    (id: string) => {
      setState((state) => ({ ...state, idDelete: id, openDialog: true }));
    },
    [setState]
  );

  return (
    <div className="question-list-root">
      <div className="header">
        <header>
          <h1>Liste des questions</h1>
        </header>
        <div className="actions">
          <Link to={"/answers"}>
            <Button variant="contained" color="secondary">
              Voir les réponses
            </Button>
          </Link>
          <Link to={"/quizs/add-question"}>
            <Button variant="contained">Ajouter des questions</Button>
          </Link>
          <Link to={`/questions/import`}>
            <Button variant="contained" color="accent">
              <UploadFile />
              Importer
            </Button>
          </Link>
        </div>
      </div>
      <div className="filter">
        <div className="select">
          <SelectInputControlledComponent
            items={
              quizQuery.data?.pages
                .map((e) => e.data.payload.items)
                .flat() as any[]
            }
            extraOptions={<MenuItem value="all">Tous</MenuItem>}
            loading={quizQuery.isFetching}
            valueGetter={(item: Quiz): string => item?.id}
            labelGetter={(item: Quiz): string => item?.id + " - " + item.title}
            label={"Quiz"}
            paginated
            onLoadMore={() => {
              quizQuery.fetchNextPage();
            }}
            onValueChange={(value) => {
              console.log(value);

              setState((state) => ({ ...state, idQuiz: value }));
            }}
          />
        </div>
      </div>
      <section className="question-list-root_main">
        <QuestionListComponent
          questions={questionQuery.data?.data.payload}
          questionsLoading={questionQuery.isFetching}
          page={state.page}
          onPageChange={function (page: number): void {
            setState((state) => ({
              ...state,
              page,
            }));
          }}
          onPageSizeChange={function (pageSize: number): void {
            setPageSize(pageSize);
          }}
          onSearchChange={function (search: string): void {
            setState((state) => ({
              ...state,
              search,
            }));
          }}
          onDeleteClick={onDeleteClick}
        />
      </section>
      {state.openDialog && (
        <ConfirmationDialogComponent
          title={"Êtes vous sur de supprimer cette question"}
          onConfirm={(): void => {
            onDelete(state.idDelete);
          }}
          onClose={(): void => {
            setState((state) => ({
              ...state,
              openDialog: false,
              idDelete: "",
            }));
          }}
        >
          Supprimer cette question ({state.idDelete}) effacera également toutes
          ses réponses. Les utilisateurs ne verront plus cette question dans les
          quiz.
        </ConfirmationDialogComponent>
      )}
    </div>
  );
};

export default QuestionListRoot;
