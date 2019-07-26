import React from "react";
import "./Loader.style.scss";

const Loader = ({ children, isDark = "" }) => {
  return (
    <div className="loader">
      <div className="loader__wrapper">
        <div className={"loader__dot " + (isDark && "loader__dot--dark")}></div>
        <div className={"loader__dot " + (isDark && "loader__dot--dark")}></div>
        <div className={"loader__dot " + (isDark && "loader__dot--dark")}></div>
        <div className={"loader__dot " + (isDark && "loader__dot--dark")}></div>
      </div>

      <span className={"loader__text " + (isDark && "loader__text--dark")}>{children}</span>
    </div>
  );
};

export default Loader;