import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import AppPagination from "../../../../shared/components/pagination/pagination.component";
import PackageListComponent from "../../components/package-list/package-list.component";
import { getAllPackages } from "../../services/package.service";
import {
  initialPackageListState,
  PackageListState,
} from "../../state/package-list.state";
import { PackageLib } from "../../types/PackageLib";
import "./package-list.root.scss";

const PackageListRoot = () => {
  const [state, setState] = useState<PackageListState>(initialPackageListState);
  const [pageSize, setPageSize] = useDebounceValue(10, 800);
  const [keyword, setKeyword] = useDebounceValue("", 800);

  const packageQuery = useQuery({
    queryKey: ["packages", pageSize, keyword, state],
    queryFn: () =>
      getAllPackages(
        { page: state.page, pageSize },
        { keyword, author: state.authorFilter, deleted: state.deleteFilter }
      ),
  });

  return (
    <div id="package-list-root">
      <div className="header">
        <h1>Liste des paquets</h1>
      </div>
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
        </div>
        <div className="right">
          Est supprimé
          <Checkbox
            size="small"
            color="error"
            onChange={(event) => {
              setState((state) => ({
                ...state,
                page: 1,
                deleteFilter: event.target.checked,
              }));
            }}
            value={true}
          />
        </div>
      </div>
      <AppLoaderComponent loading={packageQuery.isFetching}>
        <PackageListComponent
          packages={packageQuery.data?.data.payload.items as PackageLib[]}
          onKeyWordChange={(word) => setKeyword(word)}
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
      </AppLoaderComponent>
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
          onConfirm={() => {}}
          onClose={() => {
            setState((state) => ({ ...state, package: undefined }));
          }}
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
