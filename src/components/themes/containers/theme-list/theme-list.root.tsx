import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadFile } from "@mui/icons-material";
import { Button, Checkbox, InputAdornment, TextField } from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { Theme } from "../../../../shared/types/Theme";
import ThemeListComponent from "../../components/theme-list/theme-list.component";
import { deleteTheme, getAllThemes } from "../../services/theme.service";
import { initialThemeListState, ThemeListState } from "../../state/theme.state";
import "./theme-list.root.scss";

const ThemeListRoot = () => {
  const [state, setState] = useState<ThemeListState>(initialThemeListState);
  const [pageSize, setPageSize] = useDebounceValue(10, 800);
  const [keyword, setKeyword] = useDebounceValue("", 800);
  const [themeToDelete, setThemeToDelete] = useState<Theme | undefined>(
    undefined
  );
  const queryClient = useQueryClient();

  const themeQuery = useQuery({
    queryKey: [
      "themes",
      state.page,
      state.isNotDeleted,
      state.order,
      state.sort,
      pageSize,
      keyword,
    ],
    queryFn: () =>
      getAllThemes(state.page, pageSize, {
        keyword,
        isNotDeleted: state.isNotDeleted,
        sort: state.sort,
        order: state.order,
      }),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-theme"],
    mutationFn: (id: string) => deleteTheme(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["themes", state.page, pageSize],
      });

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

  const onSortChange = useCallback((model: GridSortModel) => {
    if (model[0]) {
      setState((state) => ({
        ...state,
        sort: model[0].field,
        order: model[0].sort,
      }));
    }
  }, []);

  return (
    <div id="theme-list-root">
      <header className="list-header">
        <h1>Liste des thèmes</h1>
        <div className="actions">
          <Link to={`/themes/create`}>
            <Button variant="contained">Créer</Button>
          </Link>
          <Link to={"/themes/import"}>
            <Button color="accent" className="inline-flex">
              <UploadFile />
              Importer
            </Button>
          </Link>
        </div>
      </header>
      <div className="filter">
        <div className="left">
          <TextField
            label="Mot clé, label ..."
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
        <div className="right">
          Non supprimé
          <Checkbox
            size="small"
            color="error"
            onChange={(event) => {
              setState((state) => ({
                ...state,
                page: 1,
                isNotDeleted: event.target.checked,
              }));
            }}
            value={true}
          />
        </div>
      </div>
      <ThemeListComponent
        themes={themeQuery.data?.data.payload.items ?? []}
        loading={themeQuery.isFetching}
        onDelete={(theme: Theme) => setThemeToDelete(theme)}
        onSortModelChange={onSortChange}
      />
      <AppPagination
        currentPage={state.page}
        pageSize={pageSize}
        totalPage={themeQuery.data?.data.payload.totalPage ?? 0}
        onPageChange={(page: number) =>
          setState((state) => ({ ...state, page }))
        }
        onPageSizeChange={(size: number) => {
          setState((state) => ({ ...state, page: 1 }));
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
