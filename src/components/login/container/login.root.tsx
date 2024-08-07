import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FooterRoot from "../../../shared/components/footer/container/footer-root/footer.root";
import Login from "../components/login.component";

const LoginRoot = () => {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const authRedirect = searchParam.get("redirect");

  useEffect(() => {
    if (sessionStorage.getItem("accessToken") != null) {
      navigate("/home");
    }
  }, []);

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
      <SnackbarProvider />
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
      <FooterRoot />
    </>
  );
};

export default LoginRoot;
