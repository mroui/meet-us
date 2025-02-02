import React from "react";
import "./Legend.style.scss";

const Legend = () => {
  return (
    <div className="legend">
      <span className="legend__name legend__title">Title</span>
      <div className="legend__wrapper">
        <span className="legend__name">Location</span>
        <span className="legend__name">Date</span>
        <span className="legend__name">Connect</span>
        <span className="legend__name">Members</span>
        <span className="legend__name">Active</span>
      </div>
    </div>
  );
};

export default Legend;