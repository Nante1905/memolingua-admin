import { DeleteForever } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales/frFR";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import parse from "html-react-parser";
import { enqueueSnackbar } from "notistack";
import React, { Fragment, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmationDialogComponent from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import {
  API_BASE_URL,
  ENTITY_DELETED,
} from "../../../../shared/constants/api.constant";
import { Card } from "../../../../shared/types/Card";
import { deleteCard } from "../../services/flashcard.service";
import { PackageContent } from "../../types/PackageLib";
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
  const [card, setCard] = useState<Card | undefined>(undefined);
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
        renderCell: (value) =>
          value.row.state != ENTITY_DELETED && (
            <div>
              <IconButton
                color="error"
                onClick={() => setCard(value.row)}
                size="small"
              >
                {" "}
                <DeleteForever />{" "}
              </IconButton>
            </div>
          ),
      },
    ],
    []
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
      setCard(undefined);
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

      {card && (
        <ConfirmationDialogComponent
          title="Etes vous sûr?"
          onConfirm={() => deleteMutation.mutate(card.id)}
          onClose={() => {
            setCard(undefined);
          }}
          loading={deleteMutation.isPending}
        >
          <p>
            Voulez-vous vraiment supprimer la carte ?{" "}
            <div className="no-html">{parse(card.recto)}</div>=
            <div className="no-html">{parse(card.verso)}</div>{" "}
          </p>
        </ConfirmationDialogComponent>
      )}
    </div>
  );
};

export default PackageDetails;
