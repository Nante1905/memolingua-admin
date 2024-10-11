import { Dispatch } from "@reduxjs/toolkit";
import { ADMIN_ROLE } from "../../../constants/api.constant";
import { decodeJWT, isTokenExpired } from "../../../services/auth/auth.service";
import { setIsLoggedIn, setIsTokenVerified } from "../../../store/shared.slice";

export const verifyToken = (dispatch: Dispatch) => {
  const decodedAccessToken = decodeJWT(sessionStorage.getItem("accessToken"));

  if (decodedAccessToken != null) {
    if (decodedAccessToken.role != ADMIN_ROLE) {
      sessionStorage.removeItem("accessToken");
      dispatch(setIsLoggedIn(false));
      dispatch(setIsTokenVerified(true));

      return;
    } else if (isTokenExpired(decodedAccessToken)) {
      sessionStorage.removeItem("accessToken");
      dispatch(setIsLoggedIn(false));
      dispatch(setIsTokenVerified(true));

      return;
    } else {
      dispatch(setIsLoggedIn(true));
      dispatch(setIsTokenVerified(true));
    }
  } else {
    dispatch(setIsLoggedIn(false));
    dispatch(setIsTokenVerified(true));
  }

  return;
};
