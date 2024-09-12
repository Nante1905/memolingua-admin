import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FC } from "react";
import { Link } from "react-router-dom";
import AppLoaderComponent from "../../../../shared/components/loader/app-loader.component";
import { Level } from "../../../../shared/types/Level";
import "./level-list.component.scss";

interface LevelListComponentProps {
  levels: Level[];
  levelsLoading: boolean;
}

const LevelListComponent: FC<LevelListComponentProps> = (props) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "label", headerName: "Label", width: 250 },
    {
      field: "minPts",
      headerName: "Min pts",
      width: 120,
      cellClassName: "cell-number",
    },
    {
      field: "maxPts",
      headerName: "Max pts",
      width: 120,
      cellClassName: "cell-number",
    },
    {
      field: "state",
      headerName: "État",
      width: 100,
      // TODO : Ampiana anle entity chip state component iny
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (value) => {
        return (
          <div className="actions">
            <Link to={`/levels/${value.row.id}/update`}>
              <IconButton>
                {" "}
                <Edit />{" "}
              </IconButton>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="level-list">
      <div className="data-table">
        <AppLoaderComponent loading={props.levelsLoading}>
          <DataGrid
            columns={columns}
            rows={props.levels}
            loading={props.levelsLoading}
            hideFooterPagination={true}
            onRowClick={(r) => console.log(r)}
          />
        </AppLoaderComponent>
      </div>
    </div>
  );
};

export default LevelListComponent;
