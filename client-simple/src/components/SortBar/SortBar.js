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
    ],
    chatroomsFromOldest: []
  }

  componentWillReceiveProps() {
    console.log("props", this.props.chatrooms)
    this.setState({
      chatroomsFromOldest: this.props.chatrooms
    })
  }

  sortAddedDateOldest = (a, b) => {
    console.log(a, b);  //--------------------TODO: hasnt got access to createdAt
    return a.createdAt < b.createdAt;
  }

  sortList = (event) => {
    let chatrooms = this.props.chatrooms;
    console.log(chatrooms)

    switch(event.target.value) {
    case this.state.sortOptions[0]: {
      chatrooms = this.state.chatroomsFromOldest
      break;
    }
    }
    console.log(chatrooms)
    //this.props.renderAllChatrooms(chatrooms);
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
