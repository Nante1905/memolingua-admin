/* eslint-disable react-refresh/only-export-components */
import { ThemeProvider } from "@emotion/react";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./routes";
import PageLoadingRoot from "./shared/components/page-loading/page-loading.root";
import { store } from "./shared/store/store";
import { theme } from "./shared/styles/theme";
const AppSnackbarProvider = lazy(
  () => import("./shared/components/snackbar/snackbar-provider")
);
console.log(import.meta.env);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<PageLoadingRoot />}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AppSnackbarProvider />
          <RouterProvider router={routes} />
        </Provider>
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);
