import { CircularProgress } from "@mui/material";
import { ReactNode } from "react";
import "./app-loader.component.scss";

interface AppLoaderProps {
  loading: boolean;
  children: ReactNode;
  className?: string;
  width?: string;
  heigth?: string;
  color?: string;
}

const AppLoaderComponent = (props: AppLoaderProps) => {
  return (
    <>
      {props.loading ? (
        <div className={"loader " + props?.className}>
          <CircularProgress
            style={{
              color: props.color ? props?.color : "",
              width: props.width ? props?.width : "30px",
              height: props.heigth ? props?.heigth : "30px",
            }}
          />
        </div>
      ) : (
        props.children
      )}
    </>
  );
};

export default AppLoaderComponent;
