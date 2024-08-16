import { createSlice } from "@reduxjs/toolkit";
import { CardMedia } from "../types/CardMedia";

export interface GlobalPackageState {
  cardMedias: CardMedia[];
}

export const initialGlobalPackageState: GlobalPackageState = {
  cardMedias: [],
};

export const PackageSlice = createSlice({
  name: "package",
  initialState: initialGlobalPackageState,
  reducers: {
    addEmptyCardMedia: (state) => {
      state.cardMedias = [
        ...state.cardMedias,
        { img: undefined, video: undefined, audio: undefined },
      ];
    },
    addCardMedias: (state, action) => {
      state.cardMedias = [...state.cardMedias, action.payload];
    },
    setCardMediaAt: (
      state,
      action: { payload: { index: number; media: Partial<CardMedia> } }
    ) => {
      const { index, media } = action.payload;
      state.cardMedias[index] = { ...state.cardMedias[index], ...media };
    },
    deleteCardMediaAt: (state, action) => {
      const index = action.payload;
      state.cardMedias = [
        ...state.cardMedias.slice(0, index),
        ...state.cardMedias.slice(index + 1),
      ];
    },
    resetCardMedias: (state) => {
      state.cardMedias = [];
    },
  },
});

export const {
  addEmptyCardMedia,
  addCardMedias,
  setCardMediaAt,
  deleteCardMediaAt,
  resetCardMedias,
} = PackageSlice.actions;
