import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./routes.tsx";
import AppSnackbarProvider from "./shared/components/snackbar/snackbar-provider.tsx";
import { store } from "./shared/store/store.ts";
import { theme } from "./shared/styles/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AppSnackbarProvider />
        <RouterProvider router={routes} />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);
