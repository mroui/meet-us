import React, { Component } from "react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import { withRouter } from "react-router-dom";

class ChatroomLabel extends Component {
  gotoChatroom(evt, roomId) {
    evt.preventDefault();
    evt.stopPropagation();

    console.log(`gotoChatroom.id: `, roomId);

    if (roomId)
      this.props.history.push(`/chat/${roomId}`); // DK: This causes react error
  }

  render() {
    const { chatroom: { _id, name, description, latitude, longitude } } = this.props;

    return <MarkerWithLabel
      position={{ lat: latitude, lng: longitude }}
      labelClass="chatrooms-map__label"
      labelAnchor={{ x: -20, y: 20 }}
      onClick={(e) => this.gotoChatroom(e, _id)}
    >
      <div className="chatrooms-map__label-content">
        <h2 className="chatrooms-map__label-title">#{name}</h2>
        {description ? <p>{description}</p> : ""}
      </div>
    </MarkerWithLabel>;
  }
}

export default withRouter(ChatroomLabel);