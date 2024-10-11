import SidebarComponent from "../components/sidebar-container/sidebar.component";
import { sidebarItems } from "../constants/sidebar.constant";

const SidebarRoot = () => {
  return (
    <>
      <SidebarComponent
        userImg="/vite.svg"
        userName="Minohary Nantenaina"
        userLevel="Débutant"
        sidebarItems={sidebarItems}
      />
    </>
  );
};

export default SidebarRoot;
