import { useState } from "react";
import "./navbar.component.scss";

interface NavbarComponentState {
  openList: boolean;
}

const initialState: NavbarComponentState = {
  openList: false,
};

const NavbarComponent = () => {
  const [state, setState] = useState(initialState);

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div className="left">
          <h4>Memolingua</h4>
        </div>
        <div className="right">
          <div className="lang">
            <div className="lang-box"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarComponent;
