import React, { Component } from "react";
import Marker from "react-google-maps/lib/components/Marker";
import { InfoWindow } from "react-google-maps";
import { withRouter } from "react-router-dom";

class ChatroomLabel extends Component {

  state = {
    isOpen: false
  }

  gotoChatroom(evt, roomId) {
    evt.preventDefault;
    evt.stopPropagation;

    console.log(`gotoChatroom.id: `, roomId);

    if (roomId)
      this.props.history.push(`/chat/${roomId}`); // DK: This causes react error
  }

  toggleMarkerLabel() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }


  render() {
    const { chatroom: { _id, name, description, latitude, longitude } } = this.props;

    return <Marker
      position={{ lat: latitude, lng: longitude }}
      labelClass="chatrooms-map__label"
      labelAnchor={{ x: -20, y: 20 }}
      onClick={() => this.toggleMarkerLabel()}
    >
      {this.state.isOpen && <InfoWindow>
        <div className="chatrooms-map__label-content"
          style={{display: this.state.visibilityLabel}}>
          <h2 className="chatrooms-map__label-title"
            onClick={(e) => this.gotoChatroom(e, _id)}>#{name}</h2>
          {description ? <p>{description}</p> : ""}
        </div>
      </InfoWindow>}
    </Marker>;
  }
}

export default withRouter(ChatroomLabel);