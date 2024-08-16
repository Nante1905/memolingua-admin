import { RootState } from "../../../shared/store/store";

export const getCardsMedia = (state: RootState) => state.package.cardMedias;
