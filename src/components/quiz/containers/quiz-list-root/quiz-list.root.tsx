import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import QuizListComponent from "../../components/quiz-list/quiz-list.component";
import { findAllQuizs } from "../../services/quiz.service";
import "./quiz-list.root.scss";

const QuizListRoot = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
  });

  const [debouncedValue, setValue] = useDebounceValue("", 500);

  //   const [currentPage, setCurrentPage] = useState(1);

  const quizQuery = useQuery({
    queryKey: ["quizs", pagination, debouncedValue],
    queryFn: () =>
      findAllQuizs(pagination.page, pagination.pageSize, debouncedValue),
  });

  return (
    <div className="quiz-list-root">
      <header>
        <h1>Liste des quiz</h1>
      </header>
      <QuizListComponent
        quizsLoading={quizQuery.isFetching}
        onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) =>
          setPagination((p) => ({ ...p, pageSize }))
        }
        onSearchChange={(s) => setValue(s)}
        quizs={quizQuery.data?.data.payload}
        page={pagination.page}
      />
    </div>
  );
};

export default QuizListRoot;
