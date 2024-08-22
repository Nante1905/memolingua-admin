import WidgetsIcon from "@mui/icons-material/Widgets";
import { Button } from "@mui/material";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
// import { logoutEffect } from "../../../../store/shared.effect";
// import { AppDispatch } from "../../../../store/store";
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  // const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();

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
        // onMouseLeave={() => setCollapse(true)}
        // onBlur={() => setCollapse(true)}
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
            {/* <Link to={"/profile"}> */}
            {/* <div
              className="img-container"
              style={{
                backgroundColor: props.userImg == undefined ? "black" : "unset",
                backgroundImage: `url('${props?.userImg}')`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            ></div> */}
            {/* </Link> */}
            <Link to={"/profile"}>
              <div className="name">{props.userName}</div>
            </Link>
            <div className="niveau">{props.userLevel}</div>
            {/* <Button
              variant="contained"
              className="logout-btn"
              color="accent"
              size="small"
              onClick={() =>
                dispatch(
                  logoutEffect({
                    refreshToken: localStorage.getItem("refreshToken") ?? "",
                    navigate,
                  })
                )
              }
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
            </Button> */}
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
