import "./sidebar.component.scss";

const SidebarComponent = () => {
  return (
    <div className="sidebar open">
      <div
        className="sidebar-container"
        style={{
          width: "300px",
          height: "500px",
          // border: "2px solid black",
        }}
      >
        <div className="sidebar-head">
          <div
            className="img-container"
            style={{
              backgroundColor: "black",
            }}
          ></div>
          <div className="name">Minohary Nantenaina</div>
        </div>
        <div className="sidebar-items-container"></div>
      </div>
    </div>
  );
};

export default SidebarComponent;
