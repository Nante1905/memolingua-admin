import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import { Langage } from "../../../../shared/types/Langage";
import { Paginated } from "../../../../shared/types/Paginated";
import { findPaginatedLangs } from "../../../quiz/services/quiz.service";
import LangListComponent from "../../components/lang-list/lang-list.component";
import "./lang-list.root.scss";

interface LangListRootState {
  page: number;
}

const LangListRoot = () => {
  const [state, setState] = useState<LangListRootState>({ page: 1 });
  const [pageSize, setPageSize] = useDebounceValue(8, 500);

  const langsQuery = useQuery({
    queryKey: ["langs", state.page, pageSize],
    queryFn: () => findPaginatedLangs(state.page, pageSize),
  });

  const handlePageChange = (page: number) => {
    setState((state) => ({
      ...state,
      page,
    }));
  };
  const handleLimitChange = (limit: number) => {
    if (limit == 0) limit = 1;
    setPageSize(limit);
  };

  return (
    <div className="lang-list-root">
      <header>
        <h1>Liste des langues</h1>
        <div className="actions">
          <Link to={"/langs/create"}>
            <Button variant="contained" color="secondary">
              Créer une langue
            </Button>
          </Link>
        </div>
      </header>
      <section className="lang-list-root_main">
        <LangListComponent
          langs={langsQuery.data?.data.payload as Paginated<Langage>}
          langsLoading={langsQuery.isFetching}
          page={state.page}
          onPageChange={handlePageChange}
          onPageSizeChange={handleLimitChange}
        />
      </section>
    </div>
  );
};

export default LangListRoot;
