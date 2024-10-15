import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import FooterRoot from "./shared/components/footer/container/footer-root/footer.root";
import AuthProtector from "./shared/components/guards/container/auth-protection.root";
import NavbarRoot from "./shared/components/navbar/container/navbar-root/navbar.root";
import ScrollTopRoute from "./shared/components/scroll-top/scroll-top.component";
import SidebarRoot from "./shared/components/sidebar/container/sidebar.root";
import { decodeJWT } from "./shared/services/auth/auth.service";
import { getIsLoggedIn } from "./shared/store/shared.selector";
import { setUser } from "./shared/store/shared.slice";

function App(props: { children: React.ReactNode }) {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      const token = decodeJWT(sessionStorage.getItem("accessToken"));
      if (token) {
        dispatch(
          setUser({
            id: token!.user,
            firstname: token?.name.split(" ")[0],
            lastname: token?.name
              .split(" ")
              .slice(1, token?.name.split(" ").length)
              .join(" "),
          })
        );
      }
    }
  }, [dispatch, isLoggedIn]);

  return (
    <Fragment>
      {/* TODO: uncoomment */}
      <ScrollTopRoute />
      <AuthProtector>
        <SidebarRoot />
        <NavbarRoot />
        <QueryClientProvider client={queryClient}>
          <div className="content">{props.children}</div>
        </QueryClientProvider>
        <FooterRoot />
      </AuthProtector>
    </Fragment>
  );
}

export default App;
