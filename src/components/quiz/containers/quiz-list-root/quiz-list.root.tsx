import { GridFilterItem, GridSortItem } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AppReponseError } from "../../../../shared/types/Error";
import { AppResponse } from "../../../../shared/types/Response";
import QuizListComponent from "../../components/quiz-list/quiz-list.component";
import { deleteQuiz, findAllQuizs } from "../../services/quiz.service";
import "./quiz-list.root.scss";

interface QuizListRootState {
  sort: GridSortItem;
  filter: GridFilterItem;
  openDialog: boolean;
  deleteId: string;
}

const QuizListRoot = () => {
  const [pagination, setPagination] = useState({
    page: 1,
  });

  const [pageSize, setPageSize] = useDebounceValue(10, 1000);

  const [debouncedValue, setValue] = useDebounceValue("", 500);

  const [state, setState] = useState<Partial<QuizListRootState>>();

  const onSortChange = useCallback((sort: GridSortItem) => {
    setState((state) => ({
      ...state,
      sort,
    }));
  }, []);
  const onFilterChange = useCallback((filter: GridFilterItem) => {
    setState((state) => ({
      ...state,
      filter,
    }));
  }, []);

  //   const [currentPage, setCurrentPage] = useState(1);

  const quizQuery = useQuery({
    queryKey: ["quizs", pagination, pageSize, debouncedValue, state?.sort],
    queryFn: () =>
      findAllQuizs(
        pagination.page,
        pageSize,
        debouncedValue,
        state?.sort?.field,
        state?.sort?.sort?.toString()
      ),
  });
  const queryClient = useQueryClient();

  const deleteQuizMutation = useMutation({
    mutationKey: ["quiz/delete"],
    mutationFn: (id: string) => deleteQuiz(id),
    onSuccess: (res: AppResponse<unknown>) => {
      enqueueSnackbar({ message: res.data.message, variant: "success" });
      setState((state) => ({ ...state, openDialog: false, deleteId: "" }));
      queryClient.invalidateQueries({ queryKey: ["quizs"] });
    },
    onError: (err: AppReponseError<unknown>) => {
      enqueueSnackbar({ message: err.response?.data.error, variant: "error" });
    },
  });

  const onDelete = (id: string) => {
    deleteQuizMutation.mutate(id);
  };

  return (
    <div className="quiz-list-root">
      <header>
        <h1>Liste des quiz</h1>
      </header>
      <QuizListComponent
        quizsLoading={quizQuery.isFetching}
        onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        onSearchChange={(s) => setValue(s)}
        onSortChange={onSortChange}
        onFilterChange={onFilterChange}
        quizs={quizQuery.data?.data.payload}
        page={pagination.page}
        onDeleteClick={(id) => {
          setState((state) => ({ ...state, openDialog: true, deleteId: id }));
        }}
      />
      {state?.openDialog && (
        <ConfirmationDialogComponent
          title="Êtes vous sur de supprimer ce quiz ?"
          onConfirm={() => onDelete(state.deleteId as string)}
          onClose={() =>
            setState((state) => ({ ...state, openDialog: false, deleteId: "" }))
          }
          openDialog={state.openDialog}
        >
          Si vous supprimer ce quiz (ID: {state.deleteId}), il n'apparaîtra plus
          dans les quiz que les utilisateurs peuvent effectuer mais sera
          toujours considerer dans le calcul des scores des utilisateurs qui
          l'ont déjà fait.
        </ConfirmationDialogComponent>
      )}
    </div>
  );
};

export default QuizListRoot;
