import React, { Component } from "react";
import { withGoogleMap, GoogleMap, withScriptjs } from "react-google-maps";
import "./MapChatrooms.scss";
import { gMapsConfigProps } from "../helpers";
import ChatroomLabel from "./ChatroomLabel";

class BareMap extends Component {
  render() {
    const { chatrooms } = this.props;
    console.log(`BareMap.props: `, this.props);
    
    return <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 51.75, lng: 19.46 }}>
      {chatrooms.map(chatroom => <ChatroomLabel key={chatroom._id} chatroom={chatroom} />)}
    </GoogleMap>;
  }
}

// eslint-disable-next-line react/display-name
const MapsWrapper = (mapComponent) => (props) => {
  const WrappedMap = withScriptjs(withGoogleMap(mapComponent));
  const finalProps = {...props, ...gMapsConfigProps};
  console.log(`finalProps: `, finalProps);

  return (
    <div className="chatrooms-map__container">
      <WrappedMap {...finalProps} />
    </div>
  );
};

// DK: Basically like stateful shouldComponentUpdate
export default React.memo(MapsWrapper(BareMap));