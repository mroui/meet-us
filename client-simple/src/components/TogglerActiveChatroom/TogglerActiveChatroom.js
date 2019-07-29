import React from "react";
import ActiveSvg from "../../assets/svg/active.svg";
import NonActiveSvg from "../../assets/svg/not-active.svg";
import "./TogglerActiveChatroom.style.scss";

const Toggler = ({ isChecked, toggleActive }) => {
  return (
    <label className="toggler__wrapper">
      <img src={ActiveSvg} className="toggler__icon" alt="" />

      <div className="toggler">
        <input type="checkbox" checked={isChecked ? "" : "checked"} onChange={toggleActive} className="toggler__checkbox" />
        <span className="toggler__lever"></span>
      </div>

      <img src={NonActiveSvg} className="toggler__icon" alt="" />
    </label>
  );
};

export default Toggler;