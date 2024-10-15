import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment, lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.scss";
import PageLoadingRoot from "./shared/components/page-loading/page-loading.root";
import { decodeJWT } from "./shared/services/auth/auth.service";
import { getIsLoggedIn } from "./shared/store/shared.selector";
import { setUser } from "./shared/store/shared.slice";
const FooterRoot = lazy(
  () => import("./shared/components/footer/container/footer-root/footer.root")
);
const AuthProtector = lazy(
  () => import("./shared/components/guards/container/auth-protection.root")
);
const NavbarRoot = lazy(
  () => import("./shared/components/navbar/container/navbar-root/navbar.root")
);
const ScrollTopRoute = lazy(
  () => import("./shared/components/scroll-top/scroll-top.component")
);
const SidebarRoot = lazy(
  () => import("./shared/components/sidebar/container/sidebar.root")
);

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
      <Suspense fallback={<PageLoadingRoot />}>
        <ScrollTopRoute />
        <AuthProtector>
          <SidebarRoot />
          <NavbarRoot />
          <QueryClientProvider client={queryClient}>
            <div className="content">{props.children}</div>
          </QueryClientProvider>
          <FooterRoot />
        </AuthProtector>
      </Suspense>
    </Fragment>
  );
}

export default App;
