import { Pagination, TextField } from "@mui/material";
import { FC } from "react";
import "./pagination.component.scss";

interface AppPaginationProps {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const AppPagination: FC<AppPaginationProps> = (props) => {
  return (
    <div className="app-pagination">
      <Pagination
        count={props.totalPage}
        page={props.currentPage}
        variant="outlined"
        shape="rounded"
        color="secondary"
        className="pagination"
        onChange={(_, page) => props.onPageChange(page)}
      />
      <TextField
        label="Lignes"
        type="number"
        size="small"
        sx={{
          width: "100px",
        }}
        defaultValue={props.pageSize}
        onChange={(e) => props.onPageSizeChange(Number(e.target.value))}
      />
    </div>
  );
};

export default AppPagination;
