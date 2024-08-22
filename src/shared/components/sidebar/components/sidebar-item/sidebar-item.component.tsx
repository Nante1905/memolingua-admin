import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";
import { Link } from "react-router-dom";
import { SidebarItem } from "../../types/sidebarItem";
import "./sidebar-item.component.scss";

interface SidebarItemComponentProps {
  collapse: boolean;
  sidebarItem: SidebarItem;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

const SidebarItemComponent = (props: SidebarItemComponentProps) => {
  const sidebarItemCollapseStyle = props.collapse
    ? {
        width: "50px",
        padding: "0",
        justifyContent: "center",
        boxShadow: "initial",
      }
    : {};

  const item = (
    <Link
      to={props.sidebarItem?.link}
      className="sidebar-item"
      style={{
        ...sidebarItemCollapseStyle,
      }}
    >
      {/* <Link
    className="sidebar-link"
    to={props.sidebarItem?.link}
    style={{
      display: props.collapse ? "block" : "flex",
    }}
  > */}
      <div className="sidebar-item-icon">{props?.sidebarItem?.icon}</div>
      <div
        className="sidebar-item-title"
        style={{
          display: props.collapse ? "none" : "",
        }}
      >
        {props.sidebarItem?.title}
      </div>
      {/* </Link> */}
    </Link>
  );

  return props.collapse ? (
    // <Link to={props.sidebarItem?.link}>

    <LightTooltip title={props.sidebarItem?.title} placement="right">
      {item}
    </LightTooltip>
  ) : (
    // </Link>
    item
  );
};

export default SidebarItemComponent;
