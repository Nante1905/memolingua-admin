import { createTheme } from "@mui/material";

export const theme = createTheme({
  typography: {
    fontFamily: "Roboto",
  },
  palette: {
    contrastThreshold: 3,
    primary: {
      main: "#4cd63a",
      dark: "#3caa2d",
    },
    secondary: {
      main: "#94b5e9",
      dark: "#7790b9",
    },
    error: {
      main: "#ef4043",
    },
  },
});
