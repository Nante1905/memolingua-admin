import { createTheme, styled } from "@mui/material";

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

export const HiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
