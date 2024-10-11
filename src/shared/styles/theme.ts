import { createTheme, styled } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"];
  }

  interface PaletteOptions {
    accent?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    accent: true;
  }
}

declare module "@mui/material/LinearProgress" {
  interface LinearProgressPropsColorOverrides {
    accent: true;
  }
}
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    accent: true;
  }
}

declare module "@mui/material/Badge" {
  interface BadgePropsColorOverrides {
    accent: true;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
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
    accent: {
      main: "#7d62de",
      dark: "#58469a",
      light: "#9581dc",
      contrastText: "#fff",
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
