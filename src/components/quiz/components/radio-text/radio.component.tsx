import { FormControlLabel, Radio } from "@mui/material";
import React from "react";
import "./radio.component.scss";

interface RadioComponentProps {
  value: string;
  text: string;
  active?: boolean;
}

const RadioComponent: React.FC<RadioComponentProps> = (props) => {
  return (
    <div className="radio">
      <FormControlLabel
        control={<Radio color="secondary" />}
        value={props.value}
        label={
          <div className={`radio-text ${props.active && "active"}`}>
            {props.text}
          </div>
        }
      />
    </div>
  );
};

export default RadioComponent;
