import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment } from "react";
import "./App.scss";
import FooterRoot from "./shared/components/footer/container/footer-root/footer.root";
import AuthProtector from "./shared/components/guards/container/auth-protection.root";
import NavbarRoot from "./shared/components/navbar/container/navbar-root/navbar.root";
import ScrollTopRoute from "./shared/components/scroll-top/scroll-top.component";
import SidebarRoot from "./shared/components/sidebar/container/sidebar.root";

function App(props: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
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
