import { createSlice } from "@reduxjs/toolkit";

export interface SharedState {
  isLoggedIn: boolean;
  isTokenVerified: boolean;
}

const initialState: SharedState = {
  isLoggedIn: false,
  isTokenVerified: false,
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
  },
});

export const { setIsLoggedIn, setIsTokenVerified } = SharedSlice.actions;
