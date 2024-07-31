import "./sidebar-item.component.scss";

interface SidebarItemComponentProps {
  icon?: React.ReactNode;
  title: string;
  collapse: boolean;
}

const SidebarItemComponent = (props: SidebarItemComponentProps) => {
  const sidebarItemCollapseStyle = props.collapse
    ? {
        width: "50px",
        padding: "0",
        justifyContent: "center",
        boxShadow: "initial",
      }
    : {};

  return (
    <div
      className="sidebar-item"
      style={{
        ...sidebarItemCollapseStyle,
      }}
    >
      <div className="sidebar-item-icon">{props?.icon}</div>
      <div
        className="sidebar-item-title"
        style={{
          display: props.collapse ? "none" : "",
        }}
      >
        {props.title}
      </div>
    </div>
  );
};

export default SidebarItemComponent;
