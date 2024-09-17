import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import UserListComponent from "../../components/user-list/user-list.component";
import { deleteUser, findAllUsers } from "../../services/users.service";
import "./user-list.root.scss";

interface UserListRootState {
  page: number;
  sortField: string;
  sortMode: string;
  idDelete: string;
  openDialog: boolean;
}

const UserListRoot = () => {
  const [state, setState] = useState<Partial<UserListRootState>>();
  const [pageSize, setPageSize] = useDebounceValue(8, 600);
  const [search, setSearch] = useDebounceValue("", 600);
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationKey: ["users/delete", state?.idDelete],
    mutationFn: () => deleteUser(state?.idDelete as string),
    onSuccess(res: AxiosResponse<ApiResponse>) {
      enqueueSnackbar({
        message: res.data.message,
        variant: "success",
      });
      setState((state) => ({ ...state, openDialog: false, idDelete: "" }));
      queryClient.invalidateQueries({ queryKey: ["users/all"] });
    },
    onError(err: AxiosError<ApiResponse>) {
      enqueueSnackbar({
        message: err.response?.data.error,
        variant: "error",
      });
    },
  });

  const userQuery = useQuery({
    queryKey: [
      "users/all",
      state?.page,
      pageSize,
      state?.sortField,
      state?.sortMode,
      search,
    ],
    queryFn: () =>
      findAllUsers(
        state?.page as number,
        pageSize as number,
        search,
        state?.sortField,
        state?.sortMode
      ),
  });

  return (
    <div className="user-list-root">
      <div className="header">
        <h1>Liste des utilisateurs</h1>
      </div>
      <div className="filter">
        <div className="search-bar">
          <TextField
            label="Rechercher"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon
                    icon={"fa-solid fa-magnifying-glass" as IconProp}
                  />
                </InputAdornment>
              ),
            }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="user-list-root_main">
        <UserListComponent
          loading={userQuery.isFetching}
          users={userQuery.data?.data.payload}
          onPageChange={(page: number): void => {
            setState((state) => ({ ...state, page }));
          }}
          onPageSizeChange={(pageSize: number): void => {
            setPageSize(pageSize);
          }}
          onSortChange={(model) =>
            setState((state) => ({
              ...state,
              sortField: model?.field as string,
              sortMode: model?.sort as string,
            }))
          }
          pageSize={pageSize}
          onDeleteClick={(id) =>
            setState((state) => ({ ...state, openDialog: true, idDelete: id }))
          }
        />
      </div>
      {state?.openDialog && (
        <ConfirmationDialogComponent
          title={"Êtes vous sur de supprimer cet utilisateur ?"}
          onConfirm={(): void => {
            deleteUserMutation.mutate();
          }}
          onClose={(): void => {
            setState((state) => ({
              ...state,
              openDialog: false,
              idDelete: "",
            }));
          }}
          loading={deleteUserMutation.isPending}
        >
          En supprimant cet utilisateur ({state?.idDelete}), il ne pourra plus
          acceder aux ressources de l'application et ne sera plus en mesure de
          se connecter
        </ConfirmationDialogComponent>
      )}
    </div>
  );
};

export default UserListRoot;
