import { configureStore } from "@reduxjs/toolkit";
import { SharedSlice } from "./shared.slice";

export const store = configureStore({
  reducer: {
    shared: SharedSlice.reducer,
  },
  devTools: !import.meta.env.PROD,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispaatch = typeof store.dispatch;
