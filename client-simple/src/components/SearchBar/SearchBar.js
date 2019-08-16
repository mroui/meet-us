import React, { Component } from "react";
import "./SearchBar.style.scss";
import search from "../../assets/svg/search.svg";

class SearchBar extends Component {

  state = {
    title: ""
  }

  searchEvent = () => {
    let chatrooms = this.props.chatrooms;
    let newChatrooms = [];
    var keys = Object.keys(chatrooms);
    keys.forEach(function(key){
      newChatrooms.push(chatrooms[key]);
    });

    if (this.state.title !== "") {
      newChatrooms = newChatrooms.filter((chatroom) => chatroom.name.toString().toLowerCase().includes(this.state.title.toLowerCase()));
      this.props.setNewChatrooms(newChatrooms);
    }
    else this.props.setNewChatrooms(null);
  }

  handleInput = (e) => {
    this.setState({
      title: e.target.value
    });
  }

  onEnterPress = e => {
    if (e.which === 13 && e.shiftKey === false) {
      this.searchEvent();
    }
  };

  render() {
    return (
      <div className="bar">
        <input type="text" className="bar__search" onChange={this.handleInput} placeholder="Find event..." onKeyPress={this.onEnterPress}/>
        <img src={search} className="bar__icon" onClick={this.searchEvent} alt="Search button"/>
      </div>
    );
  }
}

export default SearchBar;
