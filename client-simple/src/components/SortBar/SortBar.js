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

  sortDateLatest = (a, b) => {
    return a.date > b.date ? -1 : a.date < b.date ? 1 : a.time <= b.time ? 1 : -1;
  }

  sortList = (event) => {
    let chatrooms = this.props.chatrooms;
    let newChatrooms = [];
    var keys = Object.keys(chatrooms);
    keys.forEach(function(key){
      newChatrooms.push(chatrooms[key]);
    });

    switch(event.target.value) {
    case this.state.sortOptions[2]: {
      newChatrooms = newChatrooms.sort(this.sortDateLatest);
      break;
    }
    }
    this.props.setSortedChatrooms(newChatrooms);
  }


  render() {
    return (
      <div className="bar">
        <h3>Sort by:</h3>
        <select className="bar__select" onChange={this.sortList}>
          {this.state.sortOptions.map( (title, index) => {
            return <option key={index} value={title}>{title}</option>;
          })}
        </select>
      </div>
    );
  }
}

export default SortBar;
