import { CloseOutlined, DeleteForever, Edit } from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales/frFR";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import parse from "html-react-parser";
import { enqueueSnackbar } from "notistack";
import React, { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import {
  ADMIN_ROLE,
  API_BASE_URL,
  ENTITY_DELETED,
} from "../../../../shared/constants/api.constant";
import { ApiResponse } from "../../../../shared/types/ApiResponse";
import { Card } from "../../../../shared/types/Card";
import { Media } from "../../../../shared/types/Media";
import { deleteCard, updateCard } from "../../services/flashcard.service";
import { CardLib, PackageContent } from "../../types/PackageLib";
import UpdateCardForm from "../update-card-form/update-card-form.component";
import "./package-details.component.scss";

const readableMediaType = {
  IMG: "Image",
  AUD: "Audio",
  VID: "Vidéo",
};

interface PackageDetailsProps {
  pack: PackageContent;
}

const PackageDetails: React.FC<PackageDetailsProps> = (props) => {
  const [cardToDelete, setCardToDelete] = useState<Card | undefined>(undefined);
  const [cardToModify, setCardToModify] = useState<CardLib | undefined>(
    undefined
  );
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 120 },
      {
        field: "recto",
        headerName: "Recto",
        width: 250,
        renderCell: (value) => (
          <div className="recto no-html">{parse(value.row.recto)}</div>
        ),
      },
      {
        field: "verso",
        headerName: "Verso",
        width: 250,
        renderCell: (value) => (
          <div className="verso no-html">{parse(value.row.verso)}</div>
        ),
      },
      {
        field: "state",
        headerName: "État",
        width: 100,
        renderCell: (value) =>
          value.row.state == ENTITY_DELETED ? (
            <Chip label={`Suppr.`} color="error" size="small" />
          ) : (
            <></>
          ),
      },
      {
        field: "medias",
        headerName: "Médias",
        width: 200,
        renderCell: (value) => (
          <div className="media-links">
            {(
              value.row.medias as {
                id: string;
                mediaType: string;
                mediaPath: string;
              }[]
            ).map((m) => (
              <Fragment key={m.id}>
                <Link
                  key={m.id}
                  to={`${API_BASE_URL}/${m.mediaPath}`}
                  target="blank"
                >
                  {readableMediaType[m.mediaType as "IMG" | "AUD" | "VID"]}
                </Link>
                -
              </Fragment>
            ))}
          </div>
        ),
      },
      {
        field: "",
        headerName: "Actions",
        width: 80,
        align: "center",
        renderCell: (value) => (
          <div>
            {value.row.state != ENTITY_DELETED &&
              props.pack?.state != ENTITY_DELETED &&
              props.pack.author.role.code == ADMIN_ROLE && (
                <IconButton
                  onClick={() => setCardToModify(value.row)}
                  size="small"
                >
                  {" "}
                  <Edit />
                </IconButton>
              )}
            {value.row.state != ENTITY_DELETED && (
              <IconButton
                color="error"
                onClick={() => setCardToDelete(value.row)}
                size="small"
              >
                {" "}
                <DeleteForever />{" "}
              </IconButton>
            )}
          </div>
        ),
      },
    ],
    [props]
  );
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationKey: ["delete-card"],
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["package", props.pack?.id] });

      enqueueSnackbar({
        message: `Carte supprimée`,
        variant: "success",
        autoHideDuration: 3000,
      });
      setCardToDelete(undefined);
    },
  });

  const cardMutation = useMutation({
    mutationKey: ["update-card"],
    mutationFn: (data: {
      idCard: string;
      card: { medias: { img?: Media; video?: Media; audio?: Media } };
      removeImg?: boolean;
      removeAud?: boolean;
      removeVid?: boolean;
    }) => updateCard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["package", props.pack?.id],
      });
      enqueueSnackbar({
        message: "Carte modifiée",
        variant: "success",
        persist: false,
        autoHideDuration: 3000,
        onClose: () => {
          setCardToModify(undefined);
        },
      });
    },
    onError: (err) => {
      const axiosError = err as AxiosError<ApiResponse>;
      if (Array.isArray(axiosError.response?.data.error)) {
        axiosError.response?.data.error.map((e) =>
          e.errors.map((msg: string) =>
            enqueueSnackbar({ message: msg, variant: "error" })
          )
        );
      }
    },
  });

  return (
    <div className="package-details-body">
      <div className="package-tab package-details-tab">
        <DataGrid
          columns={columns}
          rows={props.pack?.cards}
          hideFooterPagination
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          className="package-grid"
        />
      </div>
      {cardToModify && (
        <Dialog
          open={true}
          // onClose={() => {}}
          fullWidth
        >
          <div className="dialog-action">
            <IconButton
              className="close-btn"
              onClick={() => setCardToModify(undefined)}
              color="error"
            >
              <CloseOutlined />
            </IconButton>
          </div>
          <DialogTitle>
            Modification de <strong>{cardToModify?.id}</strong>
          </DialogTitle>

          <DialogContent>
            <UpdateCardForm
              card={cardToModify}
              onSubmit={(data) =>
                cardMutation.mutate({ idCard: cardToModify.id, ...data })
              }
              isSubmitting={cardMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      )}

      {cardToDelete && (
        <ConfirmationDialogComponent
          title="Etes vous sûr?"
          onConfirm={() => deleteMutation.mutate(cardToDelete.id)}
          onClose={() => {
            setCardToDelete(undefined);
          }}
          loading={deleteMutation.isPending}
        >
          <p>
            Voulez-vous vraiment supprimer la carte ?{" "}
            <div className="no-html">{parse(cardToDelete.recto)}</div>=
            <div className="no-html">{parse(cardToDelete.verso)}</div>{" "}
          </p>
        </ConfirmationDialogComponent>
      )}
    </div>
  );
};

export default PackageDetails;
