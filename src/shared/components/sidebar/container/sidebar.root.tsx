import { useSelector } from "react-redux";
import { getLoggedInUser } from "../../../store/shared.selector";
import SidebarComponent from "../components/sidebar-container/sidebar.component";
import { sidebarItems } from "../constants/sidebar.constant";

const SidebarRoot = () => {
  const user = useSelector(getLoggedInUser);
  return (
    <>
      <SidebarComponent
        userName={[user?.firstname, user?.lastname].join(" ")}
        sidebarItems={sidebarItems}
      />
    </>
  );
};

export default SidebarRoot;
