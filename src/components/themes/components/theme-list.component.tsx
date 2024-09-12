import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DeleteForever, Edit } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import React, { Fragment, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ENTITY_DELETED } from "../../../shared/constants/api.constant";
import { Theme } from "../../../shared/types/Theme";
import "./theme-list.component.scss";

interface ThemeListProps {
  themes: Theme[];
  loading: boolean;
}

const ThemeListComponent: React.FC<ThemeListProps> = (props) => {
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 120,
      },
      { field: "label", headerName: "Label", width: 240 },
      {
        field: "icon",
        headerAlign: "center",
        headerName: "Icône",
        align: "center",
        sortable: false,
        filterable: false,
        renderCell: (value) => (
          <FontAwesomeIcon icon={value.row.icon ?? ("tag" as IconProp)} />
        ),
      },
      {
        field: "nbr",
        headerName: "Contenu",
        align: "right",
        renderCell: (value) => `${value.row.nbr} paquets`,
      },
      {
        field: "state",
        headerAlign: "center",
        headerName: "État",
        align: "center",
        width: 120,
        renderCell: (value) =>
          value.row.state == ENTITY_DELETED ? (
            <Chip label="Suppr." color="error" />
          ) : (
            <></>
          ),
      },
      {
        field: "",
        headerName: "Actions",
        width: 150,
        headerAlign: "center",
        sortable: false,
        filterable: false,
        align: "center",
        renderCell: (value) => (
          <div className="actions">
            {value.row.state != ENTITY_DELETED ? (
              <Fragment>
                <Link
                  to={`/themes/${value.row.id}/update`}
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconButton size="small">
                    {" "}
                    <Edit />{" "}
                  </IconButton>
                </Link>
                <IconButton
                  color="error"
                  onClick={(event) => {
                    event.stopPropagation();
                    // props.onClickDelete(value.row as PackageLib);
                  }}
                  size="small"
                >
                  {" "}
                  <DeleteForever />{" "}
                </IconButton>
              </Fragment>
            ) : (
              <></>
            )}
          </div>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    library.add(fas);
  }, []);
  return (
    <div className="theme-tab">
      <DataGrid
        loading={props.loading}
        columns={columns}
        rows={props.themes}
        hideFooterPagination
        localeText={{
          noRowsLabel: "Aucune donnée",
          ...frFR.components.MuiDataGrid.defaultProps.localeText,
        }}
        autoHeight
      />
    </div>
  );
};

export default ThemeListComponent;
