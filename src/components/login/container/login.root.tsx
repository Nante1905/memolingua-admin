import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FooterRoot from "../../../shared/components/footer/container/footer-root/footer.root";
import Login from "../components/login.component";

const LoginRoot = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Login />
      </QueryClientProvider>
      <FooterRoot />
    </>
  );
};

export default LoginRoot;
