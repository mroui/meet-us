import React, { Component } from "react";
import "./SortBar.style.scss";


class SortBar extends Component {
  
  state = {
    sortOptions: [
      "Date: the latest",
      "Date: the earliest",
      "Location: the nearest",
      "Location: the farthest",
      "Price: the cheapest",
      "Price: the expensive ones",
      "Added date: the newest",
      "Added date: the oldest"
    ]
  }


  render() {
    return (
      <div className="bar">
        <h3>Sort by:</h3>
        <select className="bar__select">
          {this.state.sortOptions.map( (title, key) => {
            return <option key={key} value={title}>{title}</option>
          })}
        </select>
      </div>
    )
  }
}

export default SortBar
