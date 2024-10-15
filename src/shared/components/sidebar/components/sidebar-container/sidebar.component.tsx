import WidgetsIcon from "@mui/icons-material/Widgets";
import { Button } from "@mui/material";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { logoutEffect } from "../../../../store/shared.effect";
// import { AppDispatch } from "../../../../store/store";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logOut } from "../../../../services/auth/auth.service";
import { SidebarItem } from "../../types/sidebarItem";
import SidebarItemComponent from "../sidebar-item/sidebar-item.component";
import "./sidebar.component.scss";

interface SidebarComponentProps {
  userName: string;
  sidebarItems: SidebarItem[];
}

const SidebarComponent = (props: SidebarComponentProps) => {
  const [collapse, setCollapse] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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
        ref={containerRef}
      >
        <div className="action">
          <Button
            color="secondary"
            variant="contained"
            style={{
              margin: "30px 0 0 15px",
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
            <Link to={"/profile"}>
              <div className="name">{props.userName}</div>
            </Link>
            <Button
              variant="contained"
              className="logout-btn"
              color="accent"
              size="small"
              onClick={() => {
                logOut();
                navigate("/login");
              }}
              style={{
                maxWidth: "none",
                height: "initial",
              }}
            >
              <small>
                Se deconnecter{" "}
                <span>
                  <FontAwesomeIcon
                    icon={"fa-solid fa-arrow-right-from-bracket" as IconProp}
                  />
                </span>
              </small>
            </Button>
          </div>
          <div className="sidebar-items-container">
            {props.sidebarItems.map((e, index) => (
              <SidebarItemComponent
                collapse={collapse}
                key={`sb-item-${index}`}
                sidebarItem={e}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarComponent;
