import { DeleteForever, Edit } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ADMIN_ROLE } from "../../../../shared/constants/api.constant";
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
        width: 120,
        align: "center",
        renderCell: (value) =>
          value.row.state == -1 ? (
            <Chip label={`Supprimé`} color="error" />
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
            />
          </Tooltip>
        ),
      },
      {
        field: "",
        headerName: "Action",
        width: 100,
        align: "center",

        renderCell: (value) => (
          <div className="actions">
            <Link to={`/packages/${value.row.id}/update`}>
              <IconButton>
                {" "}
                <Edit />{" "}
              </IconButton>
            </Link>
            <IconButton
              color="error"
              onClick={() => props.onClickDelete(value.row as PackageLib)}
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
