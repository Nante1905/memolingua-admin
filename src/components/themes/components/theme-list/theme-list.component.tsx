import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckCircle, DeleteForever, Edit, Error } from "@mui/icons-material";
import { Chip, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import React, { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import { ENTITY_DELETED } from "../../../../shared/constants/api.constant";
import { Theme } from "../../../../shared/types/Theme";
import "./theme-list.component.scss";

interface ThemeListProps {
  themes: Theme[];
  loading: boolean;
  onDelete: (theme: Theme) => void;
  onSortModelChange: (model: GridSortModel) => void;
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
        field: "intl",
        headerName: "Internationalisation",
        width: 150,
        align: "right",
        sortable: false,
        renderCell: (value) => (
          <div className="theme-langs">
            <span>
              {value.row.langExist}/{value.row.totalLang}
            </span>
            {value.row.langExist < value.row.totalLang ? (
              <Error color="error" />
            ) : (
              <CheckCircle color="primary" />
            )}
          </div>
        ),
      },
      {
        field: "state",
        headerAlign: "center",
        headerName: "État",
        align: "center",
        width: 120,
        sortable: false,
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
                    props.onDelete(value.row as Theme);
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
    [props]
  );

  return (
    <div className="theme-tab">
      <DataGrid
        loading={props.loading}
        columns={columns}
        rows={props.themes}
        hideFooterPagination
        disableColumnFilter
        localeText={{
          noRowsLabel: "Aucune donnée",
          ...frFR.components.MuiDataGrid.defaultProps.localeText,
        }}
        onSortModelChange={props.onSortModelChange}
        autoHeight
      />
    </div>
  );
};

export default ThemeListComponent;
