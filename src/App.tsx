import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Fragment } from "react";
import "./App.scss";
import FooterRoot from "./shared/components/footer/container/footer-root/footer.root";
import NavbarRoot from "./shared/components/navbar/container/navbar-root/navbar.root";
import SidebarRoot from "./shared/components/sidebar/container/sidebar.root";

function App(props: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <Fragment>
      <SidebarRoot />
      <NavbarRoot />
      <QueryClientProvider client={queryClient}>
        <div className="content">{props.children}</div>
      </QueryClientProvider>
      <FooterRoot />
    </Fragment>
  );
}

export default App;
