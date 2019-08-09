import React from "react";
import "./SortBar.style.scss";
import Button from "../../components/Button/Button";
import arrowDown from "../../assets/svg/arrow_down.svg";
import arrowUp from "../../assets/svg/arrow_up.svg";

const SortBar = () => {
  return (
    <div className="bar">
      <h3>Sort by:</h3>
      <Button additionalClass="bar__sortbutton">
        Date
        <img src={arrowDown} />
      </Button>
    </div>
  );
};

export default SortBar;