import { MenuItem } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import SelectInputControlledComponent from "../../../../shared/components/inputs/select-input/select-input-controlled.component";
import { Quiz } from "../../../../shared/types/Quiz";
import QuestionListComponent from "../../components/question-list/question-list.component";
import {
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
}

const QuestionListRoot = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<QuestionListRootState>({
    page: 1,
    quizPage: 1,
    idQuiz: searchParams.get("id") ?? "",
  });

  const [pageSize, setPageSize] = useDebounceValue(8, 800);

  // useLayoutEffect(() => {
  //   setState((state) => ({
  //     ...state,
  //     idQuiz: searchParams.get("id") ?? "",
  //   }));
  // }, [searchParams]);
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

  // console.log();

  return (
    <div className="question-list-root">
      <header>
        <h1>Liste des questions</h1>
      </header>
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
        />
      </section>
    </div>
  );
};

export default QuestionListRoot;
