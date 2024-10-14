import { AddCardOutlined, DeleteForever, Edit } from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import React, { Fragment, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import EntityChipStateComponent from "../../../../shared/components/entity-chip-state/entity-chip-state.component";
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
  loading: boolean;
  onSortModelChange: (model: GridSortModel) => void;
}

const PackageListComponent: React.FC<PackageListComponentProps> = (props) => {
  const navigate = useNavigate();
  const columns: GridColDef[] = useMemo(
    (): GridColDef[] => [
      { field: "id", headerName: "ID", width: 120, cellClassName: "id" },
      { field: "title", headerName: "Titre", width: 200 },
      { field: "themeLabel", headerName: "Thème", width: 150 },
      {
        field: "lSource",
        headerName: "L. Source",
        width: 140,
        sortable: false,
      },
      { field: "lTarget", headerName: "L. Cible", width: 140, sortable: false },
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
        sortable: false,
        renderCell: (value) => (
          <EntityChipStateComponent entityState={value.row.state} />
        ),
      },
      {
        field: "authorRole",
        headerName: "Auteur",
        align: "center",
        width: 80,
        sortable: false,
        renderCell: (value) => (
          <Tooltip title={value.row.authorName}>
            <Chip
              label={value.row.authorRole}
              color={
                value.row.authorRole == ADMIN_ROLE ? "secondary" : "accent"
              }
              size="small"
              variant="outlined"
            />
          </Tooltip>
        ),
      },
      {
        field: "",
        headerName: "Actions",
        width: 120,
        align: "center",
        sortable: false,
        renderCell: (value) => (
          <div className="actions">
            {value.row.authorRole == ADMIN_ROLE &&
            value.row.state != ENTITY_DELETED ? (
              <Fragment>
                <Link
                  to={`/packages/${value.row.id}/add-cards`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconButton size="small">
                    {" "}
                    <AddCardOutlined />
                  </IconButton>
                </Link>
                <Link
                  to={`/packages/${value.row.id}/update`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconButton size="small">
                    {" "}
                    <Edit />{" "}
                  </IconButton>
                </Link>
              </Fragment>
            ) : (
              <></>
            )}

            {value.row.state != ENTITY_DELETED && (
              <IconButton
                color="error"
                onClick={(event) => {
                  event.stopPropagation();
                  props.onClickDelete(value.row as PackageLib);
                }}
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

  return (
    <div className="package-list">
      <div className="package-tab">
        <DataGrid
          loading={props.loading}
          columns={columns}
          rows={props.packages}
          hideFooterPagination={true}
          localeText={{
            noRowsLabel: "Aucune donnée",
            ...frFR.components.MuiDataGrid.defaultProps.localeText,
          }}
          className="package-grid"
          onRowClick={(params) =>
            navigate(`/packages/${params.row.id}/content`)
          }
          disableColumnFilter
          filterMode="server"
          onSortModelChange={props.onSortModelChange}
          autoHeight
        />
      </div>
    </div>
  );
};

export default PackageListComponent;
