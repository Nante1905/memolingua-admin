import { ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./scroll-to-btn.component.scss";

const ScrollToBtn: React.FC<{ direction: "top" | "bottom" }> = (props) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleBtnVisibility = () => {
      setShow(
        (props.direction == "top" && window.scrollY > 200) ||
          (props.direction == "bottom" && window.screenY < 100)
      );
    };

    window.addEventListener("scroll", handleBtnVisibility);

    return () => {
      window.removeEventListener("scroll", handleBtnVisibility);
    };
  }, [props]);

  return (
    show && (
      <IconButton
        onClick={() => {
          console.log("click");

          window.scrollTo({
            top:
              props.direction == "top"
                ? 0
                : document.documentElement.scrollHeight,
            behavior: "smooth",
          });
        }}
        className={`to-${props.direction}-btn`}
      >
        {props.direction == "top" && <ArrowUpwardRounded />}
        {props.direction == "bottom" && <ArrowDownwardRounded />}
      </IconButton>
    )
  );
};

export default ScrollToBtn;
