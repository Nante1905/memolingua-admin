import { RootState } from "./store";

export const getIsLoggedIn = (state: RootState) => state.shared.isLoggedIn;
export const getIsTokenVerified = (state: RootState) =>
  state.shared.isTokenVerified;
