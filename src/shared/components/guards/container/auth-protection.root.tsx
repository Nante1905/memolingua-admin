import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getIsLoggedIn,
  getIsTokenVerified,
} from "../../../store/shared.selector";
import { verifyToken } from "../service/auth-protection.service";

const AuthProtector = (props: { children: React.ReactNode }) => {
  const accessToken = sessionStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);
  const isTokenVerified = useSelector(getIsTokenVerified);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (accessToken == null) {
      navigate(`/login?from=${location.pathname.substring(1)}`);
    } else {
      verifyToken(dispatch);
    }
  }, [accessToken, dispatch, location.pathname, navigate]);

  useEffect(() => {
    if (isTokenVerified && !isLoggedIn) {
      navigate(`/login?from=${location.pathname.substring(1)}`);
    }
  }, [isLoggedIn, isTokenVerified, navigate, location]);

  return isLoggedIn ? (
    props.children
  ) : (
    <p className="text-center">
      {" "}
      <CircularProgress color="primary" />{" "}
    </p>
  );
};

export default AuthProtector;
