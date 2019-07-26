import React from "react";
import "./Legend.style.scss";

const Legend = () => {
  return (
    <div className="legend">
      <span className="legend__name legend__title">Title</span>
      <div className="legend__wrapper">
        <span className="legend__name">Connect</span>
        <span className="legend__name">Users</span>
        <span className="legend__name">Verified</span>
      </div>
    </div>
  );
};

export default Legend;