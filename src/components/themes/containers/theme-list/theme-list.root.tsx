import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import ThemeListComponent from "../../components/theme-list.component";
import { getAllThemes } from "../../services/theme.service";
import "./theme-list.root.scss";

const ThemeListRoot = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useDebounceValue(10, 800);

  const themeQuery = useQuery({
    queryKey: ["themes", page, pageSize],
    queryFn: () => getAllThemes(page, pageSize),
  });

  return (
    <div id="theme-list-root">
      <h1>Liste des thèmes</h1>
      <Link to={`/themes/create`}>
        <Button variant="contained">Créer</Button>
      </Link>
      <ThemeListComponent
        themes={themeQuery.data?.data.payload.items ?? []}
        loading={themeQuery.isFetching}
      />
      <AppPagination
        currentPage={page}
        pageSize={pageSize}
        totalPage={themeQuery.data?.data.payload.totalPage ?? 0}
        onPageChange={(page: number) => setPage(page)}
        onPageSizeChange={(size: number) => {
          setPage(1);
          setPageSize(size);
        }}
      />
    </div>
  );
};

export default ThemeListRoot;
