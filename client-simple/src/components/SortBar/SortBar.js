import React, { Component } from "react";
import "./SortBar.style.scss";


class SortBar extends Component {
  
  state = {
    sortOptions: [
      "Added date: the oldest",
      "Added date: the newest",
      "Date: the latest",
      "Date: the earliest",
      "Location: the nearest",
      "Location: the farthest",
      "Price: the cheapest",
      "Price: the expensive ones"
    ]
  }

  sortDateOLatest = (a, b) => {
    console.log(a.date, b.date, a.date>b.date)
    return a.date > b.date;
  }

  sortList = (event) => {
    let chatrooms = this.props.chatrooms;

    switch(event.target.value) {
    case this.state.sortOptions[2]: {
      chatrooms = chatrooms.sort(this.sortDateOLatest);
      break;
    }
    }
    console.log(chatrooms)
  }


  render() {
    return (
      <div className="bar">
        <h3>Sort by:</h3>
        <select className="bar__select" onChange={this.sortList}>
          {this.state.sortOptions.map( (title, index) => {
            return <option key={index} value={title}>{title}</option>
          })}
        </select>
      </div>
    )
  }
}

export default SortBar
