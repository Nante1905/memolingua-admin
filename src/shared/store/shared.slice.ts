import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/User";

export interface SharedState {
  isLoggedIn: boolean;
  isTokenVerified: boolean;
  user?: User;
}

const initialState: SharedState = {
  isLoggedIn: false,
  isTokenVerified: false,
  user: undefined,
};

export const SharedSlice = createSlice({
  name: "shared",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsTokenVerified: (state, action) => {
      state.isTokenVerified = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setIsLoggedIn, setIsTokenVerified, setUser } =
  SharedSlice.actions;
