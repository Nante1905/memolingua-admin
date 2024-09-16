import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { FC } from "react";
import AppLoaderComponent from "../loader/app-loader.component";
import "./confirmation-dialog.component.scss";

interface ConfirmationDialogComponentProps {
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  openDialog?: boolean;
  loading?: boolean;
}

const ConfirmationDialogComponent: FC<ConfirmationDialogComponentProps> = (
  props
) => {
  return (
    <Dialog open={true} onClose={() => props.onClose()}>
      <DialogTitle>{props?.title}</DialogTitle>

      <DialogContent>{props.children}</DialogContent>
      <AppLoaderComponent loading={!!props.loading}>
        <DialogActions
          sx={{
            justifyContent: "space-around",
          }}
        >
          <Button onClick={() => props?.onConfirm()}>Confirmer</Button>
          <Button color="error" onClick={() => props?.onClose()}>
            Annuler
          </Button>
        </DialogActions>
      </AppLoaderComponent>
    </Dialog>
  );
};

export default ConfirmationDialogComponent;
