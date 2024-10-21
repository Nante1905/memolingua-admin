import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CheckCircle, DeleteForever, Edit, Error } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { frFR } from "@mui/x-data-grid/locales";
import React, { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import EntityChipStateComponent from "../../../../shared/components/entity-chip-state/entity-chip-state.component";
import { ENTITY_DELETED } from "../../../../shared/constants/api.constant";
import { ThemeLib } from "../../../../shared/types/Theme";
import "./theme-list.component.scss";

interface ThemeListProps {
  themes: ThemeLib[];
  loading: boolean;
  onDelete: (theme: ThemeLib) => void;
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
        field: "existPackage",
        headerName: "Paquets*",
        headerAlign: "right",
        align: "right",
        renderCell: (value) =>
          `${value.row.existPackage} / ${value.row.totalPackage}`,
      },
      {
        field: "existQuiz",
        headerName: "Quiz*",
        headerAlign: "right",
        align: "right",
        renderCell: (value) =>
          `${value.row.existQuiz} / ${value.row.totalQuiz}`,
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
        renderCell: (value) => (
          <EntityChipStateComponent entityState={value.row.state} />
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
                    props.onDelete(value.row as ThemeLib);
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
      <div>
        <p className="caption">
          *Paquets: Nombre de paquets existants / Nombre de paquets total
        </p>
        <p className="caption">
          *Quiz: Nombre de quiz existants / Nombre de quiz total
        </p>
      </div>
    </div>
  );
};

export default ThemeListComponent;
