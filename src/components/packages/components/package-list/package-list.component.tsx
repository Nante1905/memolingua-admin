import { DeleteForever, Edit, Visibility } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ADMIN_ROLE,
  ENTITY_DELETED,
} from "../../../../shared/constants/api.constant";
import { PackageLib } from "../../types/PackageLib";
import "./package-list.component.scss";

interface PackageListComponentProps {
  packages: PackageLib[];
  onKeyWordChange: (keyWord: string) => void;
  onClickDelete: (pack: PackageLib) => void;
}

const PackageListComponent: React.FC<PackageListComponentProps> = (props) => {
  const columns: GridColDef[] = useMemo(
    (): GridColDef[] => [
      { field: "id", headerName: "ID", width: 120 },
      { field: "title", headerName: "Titre", width: 200 },
      { field: "theme", headerName: "Thème", width: 150 },
      { field: "lSource", headerName: "L. Source", width: 140 },
      { field: "lTarget", headerName: "L. Cible", width: 140 },
      {
        field: "nb",
        headerName: "Contenu",
        width: 90,
        align: "right",
        renderCell: (value) => <>{value.row.nb} carte(s)</>,
      },
      {
        field: "creationDate",
        headerName: "Date Création",
        width: 120,
        align: "right",
        valueFormatter: (value) =>
          new Date(value).toLocaleString("fr-Fr", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        field: "state",
        headerName: "État",
        width: 100,
        align: "center",
        renderCell: (value) =>
          value.row.state == ENTITY_DELETED ? (
            <Chip label={`Suppr.`} color="error" size="small" />
          ) : (
            <></>
          ),
      },
      {
        field: "authorRole",
        headerName: "Auteur",
        align: "center",
        width: 80,
        renderCell: (value) => (
          <Tooltip title={value.row.authorName}>
            <Chip
              label={value.row.authorRole}
              color={
                value.row.authorRole == ADMIN_ROLE ? "secondary" : "accent"
              }
              size="small"
            />
          </Tooltip>
        ),
      },
      {
        field: "",
        headerName: "Actions",
        width: 120,
        align: "center",
        renderCell: (value) => (
          <div className="actions">
            <Link to={`/packages/${value.row.id}/content`}>
              <IconButton size="small">
                {" "}
                <Visibility />
              </IconButton>
            </Link>
            {value.row.authorRole == ADMIN_ROLE ? (
              <Link to={`/packages/${value.row.id}/update`}>
                <IconButton size="small">
                  {" "}
                  <Edit />{" "}
                </IconButton>
              </Link>
            ) : (
              <></>
            )}

            <IconButton
              color="error"
              onClick={() => props.onClickDelete(value.row as PackageLib)}
              size="small"
            >
              {" "}
              <DeleteForever />{" "}
            </IconButton>
          </div>
        ),
      },
    ],
    [props]
  );

  return (
    <div className="package-list">
      <div className="package-tab">
        <DataGrid
          columns={columns}
          rows={props.packages}
          hideFooterPagination={true}
          localeText={frFR.components.MuiDataGrid.defaultProps.localeText}
          className="package-grid"
        />
      </div>
    </div>
  );
};

export default PackageListComponent;
