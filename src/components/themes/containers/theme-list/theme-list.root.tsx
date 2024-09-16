import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { Theme } from "../../../../shared/types/Theme";
import ThemeListComponent from "../../components/theme-list/theme-list.component";
import { deleteTheme, getAllThemes } from "../../services/theme.service";
import "./theme-list.root.scss";

const ThemeListRoot = () => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useDebounceValue(10, 800);
  const [themeToDelete, setThemeToDelete] = useState<Theme | undefined>(
    undefined
  );
  const queryClient = useQueryClient();

  const themeQuery = useQuery({
    queryKey: ["themes", page, pageSize],
    queryFn: () => getAllThemes(page, pageSize),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-theme"],
    mutationFn: (id: string) => deleteTheme(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["themes", page, pageSize] });

      enqueueSnackbar({
        message: `Thème ${themeToDelete?.label ?? ""} et ses ${
          themeToDelete?.nbr ?? ""
        } paquets supprimés`,
        variant: "success",
        autoHideDuration: 3000,
      });
      setThemeToDelete(undefined);
    },
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
        onDelete={(theme: Theme) => setThemeToDelete(theme)}
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

      {themeToDelete && (
        <ConfirmationDialogComponent
          title="Etes vous sûr?"
          onConfirm={() => deleteMutation.mutate(themeToDelete.id as string)}
          onClose={() => {
            setThemeToDelete(undefined);
          }}
          loading={deleteMutation.isPending}
        >
          <p>
            Voulez-vous vraiment supprimer le thème{" "}
            <strong>"{themeToDelete.label}"</strong> et les{" "}
            <strong> {themeToDelete.nbr ?? ""} paquet(s)</strong> rattaché à lui
            ?{" "}
          </p>
        </ConfirmationDialogComponent>
      )}
    </div>
  );
};

export default ThemeListRoot;
