import React, { Component } from "react";
import "./SearchBar.style.scss";
import search from "../../assets/svg/search.svg";

class SearchBar extends Component {

  state = {
    title: "",
    error: ""
  }

  searchEvent = () => {
    let chatrooms = this.props.chatrooms;
    let newChatrooms = [];
    var keys = Object.keys(chatrooms);
    keys.forEach(function(key){
      newChatrooms.push(chatrooms[key]);
    });

    newChatrooms = newChatrooms.filter((chatroom) => chatroom.name.includes(this.state.title));

    if (newChatrooms.length>0) this.props.setSortedChatrooms(newChatrooms);
    else this.setState({error: "No results!"})
  }

  handleInput = (e) => {
    this.setState({
      title: e.target.value,
      error: ""
    });
  }

  onEnterPress = e => {
    if (e.which === 13 && e.shiftKey === false) {
      this.searchEvent();
    }
  };

  render() {
    return (
      <>
      <div className="bar">
        <input type="text" className="bar__search" onChange={this.handleInput} placeholder="Find event..." onKeyPress={this.onEnterPress}/>
        <img src={search} className="bar__icon" onClick={this.searchEvent} alt="Search button"/>
      </div>
      <span className="bar__error">{this.state.error}</span>
      </>
    );
  }
}

export default SearchBar;
