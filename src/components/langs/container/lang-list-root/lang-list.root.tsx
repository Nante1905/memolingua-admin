import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, InputAdornment, TextField } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import { Langage } from "../../../../shared/types/Langage";
import { Paginated } from "../../../../shared/types/Paginated";
import LangListComponent from "../../components/lang-list/lang-list.component";
import { getAllLangs } from "../../services/lang.service";
import {
  initialLangListState,
  LangListRootState,
} from "../../state/langs.state";
import "./lang-list.root.scss";

const LangListRoot = () => {
  const [state, setState] = useState<LangListRootState>(initialLangListState);
  const [pageSize, setPageSize] = useDebounceValue(8, 800);
  const [keyword, setKeyword] = useDebounceValue("", 800);

  const langsQuery = useQuery({
    queryKey: ["langs", state.page, pageSize, state.order, state.sort, keyword],
    queryFn: () =>
      getAllLangs(state.page, pageSize, {
        keyword,
        sort: state.sort,
        order: state.order,
      }),
  });

  const onSortChange = useCallback((model: GridSortModel) => {
    if (model[0]) {
      console.log(model[0]);

      setState((state) => ({
        ...state,
        sort: model[0].field,
        order: model[0].sort,
      }));
    }
  }, []);

  const handlePageChange = (page: number) => {
    setState((state) => ({
      ...state,
      page,
    }));
  };
  const handleLimitChange = (limit: number) => {
    if (limit == 0) limit = 1;
    setPageSize(limit);
    setState((state) => ({
      ...state,
      page: 1,
    }));
  };

  return (
    <div className="lang-list-root">
      <header className="list-header">
        <h1>Liste des langues</h1>
        <div className="actions">
          <Link to={"/langs/create"}>
            <Button variant="contained">Créer une langue</Button>
          </Link>
        </div>
      </header>
      <div className="filter">
        <TextField
          label="Mot clé, Titre, Thème, ..."
          size="small"
          className="input"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon
                  icon={"fa-solid fa-magnifying-glass" as IconProp}
                />
              </InputAdornment>
            ),
          }}
          onChange={(event) => {
            setKeyword(event.target.value);
            setState((state) => ({
              ...state,
              page: 1,
            }));
          }}
        />
      </div>
      <section className="lang-list-root_main">
        <LangListComponent
          langs={langsQuery.data?.data.payload as Paginated<Langage>}
          langsLoading={langsQuery.isFetching}
          page={state.page}
          onPageChange={handlePageChange}
          onPageSizeChange={handleLimitChange}
          onSortModelChange={onSortChange}
        />
      </section>
    </div>
  );
};

export default LangListRoot;
