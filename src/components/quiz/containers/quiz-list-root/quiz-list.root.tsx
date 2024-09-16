import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import QuizListComponent from "../../components/quiz-list/quiz-list.component";
import { findAllQuizs } from "../../services/quiz.service";
import "./quiz-list.root.scss";

const QuizListRoot = () => {
  const [pagination, setPagination] = useState({
    page: 1,
  });

  const [pageSize, setPageSize] = useDebounceValue(10, 1000);

  const [debouncedValue, setValue] = useDebounceValue("", 500);

  //   const [currentPage, setCurrentPage] = useState(1);

  const quizQuery = useQuery({
    queryKey: ["quizs", pagination, pageSize, debouncedValue],
    queryFn: () => findAllQuizs(pagination.page, pageSize, debouncedValue),
  });

  return (
    <div className="quiz-list-root">
      <header className="list-header">
        <h1>Liste des quiz</h1>
        <div className="actions">
          <Link to={`/quizs/create`}>
            <Button variant="contained">Créer</Button>
          </Link>
        </div>
      </header>
      <QuizListComponent
        quizsLoading={quizQuery.isFetching}
        onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        onSearchChange={(s) => setValue(s)}
        quizs={quizQuery.data?.data.payload}
        page={pagination.page}
      />
    </div>
  );
};

export default QuizListRoot;
