import { Close } from "@mui/icons-material";
import { SnackbarProvider, closeSnackbar } from "notistack";

const AppSnackbarProvider = () => {
  return (
    <SnackbarProvider
      autoHideDuration={3000}
      maxSnack={5}
      action={(snackbarId) => (
        <Close
          style={{
            cursor: "pointer",
          }}
          onClick={() => closeSnackbar(snackbarId)}
        />
      )}
    />
  );
};

export default AppSnackbarProvider;
