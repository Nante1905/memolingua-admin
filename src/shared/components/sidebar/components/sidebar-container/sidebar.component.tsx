import WidgetsIcon from "@mui/icons-material/Widgets";
import { Button } from "@mui/material";
import { useState } from "react";
import { SidebarItem } from "../../types/sidebarItem";
import SidebarItemComponent from "../sidebar-item/sidebar-item.component";
import "./sidebar.component.scss";

interface SidebarComponentProps {
  userImg?: string;
  userName: string;
  userLevel: string;
  sidebarItems: SidebarItem[];
}

const SidebarComponent = (props: SidebarComponentProps) => {
  const [collapse, setCollapse] = useState(true);

  const sidebarCollapseStyle = collapse
    ? {
        minWidth: "70px",
      }
    : {};
  return (
    <div className={"sidebar "}>
      <div
        className={`sidebar-container ${collapse ? "close" : "open"}`}
        style={{
          ...sidebarCollapseStyle,
        }}
      >
        <div className="action">
          <Button
            color="secondary"
            variant="contained"
            style={{
              margin: "30px 0 0 8px",
            }}
            onClick={() => setCollapse(!collapse)}
          >
            <WidgetsIcon />
          </Button>
        </div>
        <div className="sidebar-content">
          <div
            className="sidebar-head"
            style={{
              opacity: collapse ? "0" : "",
              maxWidth: collapse ? "70px" : "",
              maxHeight: collapse ? "20px" : "",
            }}
          >
            <div
              className="img-container"
              style={{
                backgroundColor: props.userImg == undefined ? "black" : "unset",
                backgroundImage: `url('${props?.userImg}')`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div>
            <div className="name">{props.userName}</div>
            <div className="niveau">{props.userLevel}</div>
          </div>
          <div className="sidebar-items-container">
            {props.sidebarItems.map((e, index) => (
              <SidebarItemComponent
                collapse={collapse}
                title={e.title}
                icon={e?.icon}
                key={`sb-item-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
