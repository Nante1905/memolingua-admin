import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FooterRoot from "../../../shared/components/footer/container/footer-root/footer.root";
import { decodeJWT } from "../../../shared/services/auth/auth.service";
import Login from "../components/login.component";

const LoginRoot = () => {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const authRedirect = searchParam.get("from");

  useEffect(() => {
    if (sessionStorage.getItem("accessToken") != null) {
      const exp = new Date(
        decodeJWT(sessionStorage.getItem("accessToken") as string).exp
      );
      if (exp < new Date()) {
        return;
      }
      navigate("/home");
    }
  }, [navigate]);

  useEffect(() => {
    if (authRedirect == "true") {
      enqueueSnackbar({
        message: "Veuillez vous connecter pour continuer",
        variant: "error",
      });
    }
  }, [authRedirect]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Login from={authRedirect} />
      </QueryClientProvider>
      <FooterRoot />
    </>
  );
};

export default LoginRoot;
