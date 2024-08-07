import { Close } from "@mui/icons-material";
import { SnackbarProvider, closeSnackbar } from "notistack";

const AppSnackbarProvider = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
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
