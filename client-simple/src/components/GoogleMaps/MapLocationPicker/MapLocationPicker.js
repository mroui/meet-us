import React, { Component } from "react";
import { withGoogleMap, GoogleMap, withScriptjs } from "react-google-maps";
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox";
import { gMapsConfigProps } from "../helpers";
import { FormInput } from "../../Form/Form";
import ResultsMarker from "./ResultsMarker";
import _ from "lodash";
import "./MapLocationPicker.scss";

let refs = {};

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

    if (map) {
      this.setState({bounds: map.getBounds()});
    }
  }, 1000)

  onSearchBoxMounted = ref => {
    this.setState(state => ({refs: {...state.refs, searchBox: ref}}));
  };

  calculateNewCenterOfMap = markers => {
    return (markers && markers[0] && markers[0].position);
  };

  selectLocation = selectedMarker => {
    const { onLocationPick } = this.props;
    console.log("Selected location: ", location);
    this.setState({markers: [selectedMarker]});
    if (onLocationPick) onLocationPick(selectedMarker);
  }

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

    console.log(`bounds: `, bounds);
    const nextMarkers = places.map((place, idx) => ({
      name: place.name,
      description: place.formatted_address,
      position: place.geometry.location,
      idx
    }));

    console.log(`nextMarkers: `, nextMarkers);
    const nextCenter = this.calculateNewCenterOfMap(nextMarkers);

    this.setState({
      center: nextCenter,
      markers: nextMarkers,
    });

    map.fitBounds(bounds);
  }

  render() {
    const google = window.google;
    const { markers, center, bounds, refs: {map} } = this.state;
    console.log(`LocPicker.bounds`, bounds);

    return <GoogleMap
      ref={this.onMapMounted}
      defaultZoom={12}
      defaultCenter={center}
      onBoundsChanged={this.onBoundsChanged}
    >
      <SearchBox
        ref={this.onSearchBoxMounted}
        bounds={bounds}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlacesChanged={this.onPlacesChanged}>
        <div className="map-location__search-wrapper">
          <FormInput
            placeholder="Find an place..."
            additionalClass={"map-location__search"} />
        </div>
      </SearchBox>
      {markers.map((marker, index) =>
        <ResultsMarker key={index} marker={marker} onSelect={this.selectLocation} />
      )}
    </GoogleMap>;
  }
}

// eslint-disable-next-line react/display-name
const MapsWrapper = mapComponent => props => {
  const WrappedMap = withScriptjs(withGoogleMap(mapComponent));
  const finalProps = {...props, ...gMapsConfigProps};

  return (<WrappedMap {...finalProps} />);
};

// DK: Basically like stateful shouldComponentUpdate
export default React.memo(MapsWrapper(BareMap));