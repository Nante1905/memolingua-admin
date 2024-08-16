import { configureStore } from "@reduxjs/toolkit";
import { PackageSlice } from "../../components/packages/store/package.slice";
import { SharedSlice } from "./shared.slice";

export const store = configureStore({
  reducer: {
    shared: SharedSlice.reducer,
    package: PackageSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispaatch = typeof store.dispatch;
