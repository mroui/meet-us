import React, { Component } from "react";
import "./SortBar.style.scss";
import Button from "../../components/Button/Button";
import arrowDown from "../../assets/svg/arrow_down.svg";
import arrowUp from "../../assets/svg/arrow_up.svg";


class SortBar extends Component {
  render() {
    return (
      <div className="bar">
        <h3>Sort by:</h3>
        <Button additionalClass="bar__button">
          Distance
          <img className="bar__icon" src={arrowDown} />
        </Button>
      </div>
    )
  }
}

export default SortBar
