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
            style={
              props.width || props.heigth || props.color
                ? {
                    color: props?.color,
                    width: props?.width,
                    height: props?.heigth,
                  }
                : undefined
            }
          />
        </div>
      ) : (
        props.children
      )}
    </>
  );
};

export default AppLoaderComponent;
