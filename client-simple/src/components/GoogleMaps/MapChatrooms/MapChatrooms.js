import React, { Component } from "react";
import { withGoogleMap, GoogleMap, withScriptjs } from "react-google-maps";
import "./MapChatrooms.scss";
import { gMapsConfigProps } from "../helpers";
import ChatroomLabel from "./ChatroomLabel";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import { FormInput } from "../../Form/Form";
import "../MapLocationPicker/MapLocationPicker.scss";
import _ from "lodash";

class BareMap extends Component {
  state = {
    bounds: null,
    center: { lat: 51.75, lng: 19.46 },
    markers: [],
    refs: {}
  };
  
  onMapMounted = ref => {
    this.setState(state => ({refs: { ...state.refs, map: ref }}));
  };

  onBoundsChanged = _.throttle(() => {
    const { refs: { map } } = this.state;
    if (map) {this.setState({bounds: map.getBounds()});}
  }, 1000)

  onSearchBoxMounted = ref => {
    this.setState(state => ({refs: {...state.refs, searchBox: ref}}));
  };

  calculateNewCenterOfMap = markers => {
    return (markers && markers[0] && markers[0].position);
  };

  onPlacesChanged = () => {
    const { refs: { searchBox, map } } = this.state;
    const google = window.google;
    const places = searchBox.getPlaces();
    const bounds = new google.maps.LatLngBounds();

    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });

    const nextMarkers = places.map((place, idx) => ({
      name: place.name,
      description: place.formatted_address,
      position: place.geometry.location,
      idx
    }));

    const nextCenter = this.calculateNewCenterOfMap(nextMarkers);

    this.setState({
      center: nextCenter,
      markers: nextMarkers,
    });
    
    map.fitBounds(bounds);
  }

  render() {
    const { chatrooms } = this.props;
    const google = window.google;
    
    return <GoogleMap
      ref={this.onMapMounted}
      defaultZoom={12}
      defaultCenter={{ lat: 51.75, lng: 19.46 }}
      onBoundsChanged={this.onBoundsChanged}>

      {chatrooms.map(chatroom => <ChatroomLabel key={chatroom._id} chatroom={chatroom} />)}
      
      <SearchBox
        ref={this.onSearchBoxMounted}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={this.onPlacesChanged}>
        <div className="map-location__search-wrapper">
          <FormInput
            placeholder="Find an place..."
            additionalClass={"map-location__search"} />
        </div>
      </SearchBox>

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