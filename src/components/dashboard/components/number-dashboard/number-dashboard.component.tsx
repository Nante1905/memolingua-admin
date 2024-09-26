import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import "./number-dashboard.component.scss";

interface NumberDashboardComponentProps {
  icon: IconProp;
  nbr: number;
  label: string;
  className?: string;
}

const NumberDashboardComponent: FC<NumberDashboardComponentProps> = (props) => {
  return (
    <div className={`number-item ${props?.className}`}>
      <FontAwesomeIcon
        icon={(props?.icon ?? "tag") as IconProp}
        className="number-icon"
      />
      <em>
        <h3>{props?.nbr}</h3>
      </em>
      <p>
        <small>{props?.label}</small>
      </p>
    </div>
  );
};

export default NumberDashboardComponent;
