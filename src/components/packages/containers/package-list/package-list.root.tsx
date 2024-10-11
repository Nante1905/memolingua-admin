import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UploadFile } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { GridSortModel } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounceValue } from "usehooks-ts";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import SelectInputControlledComponent from "../../../../shared/components/inputs/select-input/select-input-controlled.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import { Langage } from "../../../../shared/types/Langage";
import { getNonPaginatedLangs } from "../../../langs/services/lang.service";
import PackageListComponent from "../../components/package-list/package-list.component";
import { deletePackage, getAllPackages } from "../../services/package.service";
import {
  initialPackageListState,
  PackageListState,
} from "../../state/package-list.state";
import { PackageLib } from "../../types/PackageLib";
import "./package-list.root.scss";

const PackageListRoot = () => {
  const [state, setState] = useState<PackageListState>(initialPackageListState);
  const [pageSize, setPageSize] = useDebounceValue(10, 800);
  const [keyword, setKeyword] = useDebounceValue("", 500);
  const queryClient = useQueryClient();

  const packageQuery = useQuery({
    queryKey: ["packages", pageSize, keyword, state],
    queryFn: () =>
      getAllPackages(
        { page: state.page, pageSize },
        {
          keyword,
          author: state.authorFilter,
          notDeleted: state.isNotDeleted,
          sort: state.sort,
          order: state.order ?? "asc",
          source: state.source,
          target: state.target,
        }
      ),
  });

  const langQuery = useQuery({
    queryKey: ["all-langs"],
    queryFn: getNonPaginatedLangs,
  });

  const langages = useMemo(
    () => [{ id: "", label: "Tous" }, ...(langQuery.data?.data.payload ?? [])],
    [langQuery.data]
  );

  const onSortChange = useCallback((model: GridSortModel) => {
    if (model[0]) {
      setState((state) => ({
        ...state,
        sort: model[0].field,
        order: model[0].sort,
      }));
    }
  }, []);

  const deleteMutation = useMutation({
    mutationKey: ["delete-package"],
    mutationFn: (id: string) => deletePackage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });

      enqueueSnackbar({
        message: `Paquet ${state.package?.title ?? ""} supprimé`,
        variant: "success",
        autoHideDuration: 3000,
      });
      setState((state) => ({
        ...state,
        package: undefined,
      }));
    },
  });

  return (
    <div id="package-list-root">
      <header className="list-header">
        <h1>Liste des paquets</h1>
        <div className="actions">
          <Link to={`/packages/create`}>
            <Button variant="contained">Créer</Button>
          </Link>
          <Link to={`/packages/import`}>
            <Button color="accent" className="inline-flex" variant="contained">
              <UploadFile />
              Importer des paquets
            </Button>
          </Link>
          <Link to={`/cards/import`}>
            <Button color="accent" className="inline-flex" variant="contained">
              <UploadFile />
              Importer des cartes
            </Button>
          </Link>
        </div>
      </header>

      <div className="filter-content">
        <div className="left">
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
          <FormControl size="small" className="radios">
            <FormLabel id="demo-radio-buttons-group-label">Auteur: </FormLabel>
            <RadioGroup
              defaultValue="all"
              row
              onChange={(event) => {
                setState((state) => ({
                  ...state,
                  page: 1,
                  authorFilter: event.target.value,
                }));
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio size="small" />}
                label="Tous"
              />
              <FormControlLabel
                value="public"
                control={<Radio size="small" />}
                label="Admin"
              />
              <FormControlLabel
                value="user"
                control={<Radio size="small" />}
                label="Utilisateur"
              />
            </RadioGroup>
          </FormControl>
          <SelectInputControlledComponent
            items={langages}
            defaultValue={""}
            loading={langQuery.isFetching}
            size="small"
            valueGetter={(item: Langage) => item.id}
            labelGetter={(item: Langage) => item.label}
            label={"Source"}
            onValueChange={(value: string) =>
              setState((state) => ({ ...state, source: value }))
            }
            className="lang-select"
          />
          <SelectInputControlledComponent
            items={langages}
            defaultValue={""}
            loading={langQuery.isFetching}
            size="small"
            valueGetter={(item: Langage) => item.id}
            labelGetter={(item: Langage) => item.label}
            label={"Cible"}
            onValueChange={(value: string) =>
              setState((state) => ({ ...state, target: value }))
            }
            className="lang-select"
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

      <PackageListComponent
        loading={packageQuery.isFetching}
        packages={packageQuery.data?.data.payload.items as PackageLib[]}
        onKeyWordChange={(word) => setKeyword(word)}
        onSortModelChange={onSortChange}
        onClickDelete={(pack) =>
          setState((state) => ({
            ...state,
            package: {
              id: pack.id,
              title: pack.title,
            },
          }))
        }
      />
      <AppPagination
        currentPage={state.page}
        pageSize={pageSize}
        totalPage={packageQuery.data?.data.payload?.totalPage ?? 0}
        onPageChange={(page) => {
          setState((state) => ({
            ...state,
            page: page,
          }));
        }}
        onPageSizeChange={(pageSize) => {
          setState((state) => ({
            ...state,
            page: 1,
          }));
          setPageSize(pageSize);
        }}
      />
      {state.package && (
        <ConfirmationDialogComponent
          title="Etes vous sûr?"
          onConfirm={() => deleteMutation.mutate(state.package?.id as string)}
          onClose={() => {
            setState((state) => ({ ...state, package: undefined }));
          }}
          loading={deleteMutation.isPending}
        >
          <p>
            Voulez-vous vraiment supprimer le paquet{" "}
            <strong>"{state.package.title}"</strong> ?{" "}
          </p>
        </ConfirmationDialogComponent>
      )}
    </div>
  );
};

export default PackageListRoot;
