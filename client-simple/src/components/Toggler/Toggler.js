import React from "react";
import MapPinSvg from "../../assets/svg/map_pin.svg";
import ListSvg from "../../assets/svg/list.svg";
import "./Toggler.style.scss";

const Toggler = ({ isChecked, toggleMap }) => {
  return (
    <label className="toggler__wrapper">
      <img src={ListSvg} className="toggler__icon" alt="" />

      <div className="toggler">
        <input type="checkbox" checked={isChecked ? "checked" : ""} onChange={toggleMap} className="toggler__checkbox" />
        <span className="toggler__lever"></span>
      </div>

      <img src={MapPinSvg} className="toggler__icon" alt="" />
    </label>
  );
};

export default Toggler;