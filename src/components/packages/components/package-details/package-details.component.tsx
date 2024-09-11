import { DeleteForever } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales/frFR";
import parse from "html-react-parser";
import React, { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  API_BASE_URL,
  ENTITY_DELETED,
} from "../../../../shared/constants/api.constant";
import { getFullName } from "../../../../shared/helpers/formatter";
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
              <Fragment>
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
            <IconButton
              color="error"
              onClick={() => console.log(value.row.id)}
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

  return (
    <div className="package-details-body">
      <div className="infos">
        <p>
          <strong>Id:</strong> {props.pack.id}{" "}
          {props.pack.state == ENTITY_DELETED && (
            <Chip label={`Supprimé`} color="error" />
          )}
        </p>

        <p>
          <strong>Auteur: </strong> {getFullName(props.pack.author)}
        </p>
      </div>
      <div className="package-tab package-details-tab">
        <DataGrid
          columns={columns}
          rows={props.pack.cards}
          hideFooterPagination
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          className="package-grid"
        />
      </div>
    </div>
  );
};

export default PackageDetails;
