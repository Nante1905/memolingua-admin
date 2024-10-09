import { MenuItem } from "@mui/material";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SelectInputControlledComponent from "../../../../shared/components/inputs/select-input/select-input-controlled.component";
import { QuizQuestion } from "../../../../shared/types/QuizQuestion";
import AnswerListComponent from "../../components/answer-list/answer-list.component";

import { useDebounceValue } from "usehooks-ts";
import {
  findAllAnswers,
  findAllQuestionsSelect,
} from "../../services/quiz.service";
import "./answer-list.root.scss";

interface AnswerListRootState {
  page: number;
  quizPage: number;
  idQuestion?: string;
  question?: string;
}

const AnswerListRoot = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<AnswerListRootState>({
    page: 1,
    quizPage: 1,
    idQuestion: searchParams.get("id") ?? "",
  });

  // useLayoutEffect(() => {
  //   setState((state) => ({
  //     ...state,
  //     idQuestion: searchParams.get("id") ?? "",
  //   }));
  // }, [searchParams]);
  const [search, setSearch] = useDebounceValue("", 800);
  const [pageSize, setPageSize] = useDebounceValue(8, 800);
  const answersQuery = useQuery({
    queryKey: ["answer", state.page, state.idQuestion, search, pageSize],
    queryFn: () =>
      findAllAnswers(state.page, state.idQuestion, search, pageSize),
  });
  const questionQuery = useInfiniteQuery({
    queryKey: ["question/all"],
    initialPageParam: 1,
    queryFn: findAllQuestionsSelect,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.payload.page;
      if (lastPage.data.payload.totalPage > currentPage) return currentPage + 1;
      else return undefined;
    },
  });

  const questions = useMemo(
    () =>
      questionQuery.data?.pages
        .map((e) => e.data.payload.items)
        .flat() as any[],
    [questionQuery.data]
  );

  // console.log();

  return (
    <div className="answer-list-root">
      <header>
        <h1>Liste des réponses</h1>
      </header>
      <div className="filter">
        <div className="select">
          <SelectInputControlledComponent
            items={questions}
            extraOptions={<MenuItem value="all">Tous</MenuItem>}
            loading={questionQuery.isFetching}
            valueGetter={(item: QuizQuestion): string => item?.id}
            labelGetter={(item: QuizQuestion): string =>
              item?.id + " - " + item?.question
            }
            label={"Question"}
            paginated
            onLoadMore={() => {
              questionQuery.fetchNextPage();
            }}
            onValueChange={(value) => {
              console.log(value);

              setState((state) => ({
                ...state,
                idQuestion: value,
                question:
                  value != "all"
                    ? questions.find((e: QuizQuestion) => e.id === value)
                        .question
                    : "",
              }));
            }}
          />
        </div>
      </div>
      <section className="answer-list-root_main">
        <div className="question">
          Question : {parse(state?.question ?? "")}
        </div>
        <AnswerListComponent
          answers={answersQuery.data?.data.payload}
          answersLoading={answersQuery.isFetching}
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
            setSearch(search);
          }}
        />
      </section>
    </div>
  );
};

export default AnswerListRoot;
