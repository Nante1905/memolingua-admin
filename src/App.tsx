import { Fragment } from "react";
import "./App.scss";
import FooterRoot from "./shared/components/footer/container/footer-root/footer.root";
import NavbarRoot from "./shared/components/navbar/container/navbar-root/navbar.root";
import SidebarRoot from "./shared/components/sidebar/container/sidebar.root";

function App(props: { children: React.ReactNode }) {
  return (
    <Fragment>
      <SidebarRoot />
      <NavbarRoot />
      <div className="content">{props.children}</div>
      <FooterRoot />
    </Fragment>
  );
}

export default App;
