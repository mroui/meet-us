import React, { Component } from "react";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Button from "../../Button/Button";

class ResultsMarker extends Component {
  state = {
    labelZIdx: null
  }

  bringToForeground = () => this.setState({labelZIdx: 1000});
  bringToBackground = () => this.setState({labelZIdx: null});

  onClickFilter = evt => {
    const { onSelect, marker } = this.props;
    // DK: due to MarkerWithLabel specifics, cannot be done other way
    if (evt.target && evt.target.name === "select-btn") {
      onSelect(marker);
    }
  }

  render() {
    const { marker } = this.props;
    const { name, description, position } = marker;

    return <MarkerWithLabel
      position={position}
      zIndex={this.state.labelZIdx}
      labelClass="map-location__label"
      labelAnchor={{x: 0, y: 0}}
      clickable={true}
      onClick={this.onClickFilter}
      onMouseOver={this.bringToForeground}
      onMouseOut={this.bringToBackground}>
      <div className="map-location__label-content">
        <h2 className="map-location__label-title">{name}</h2>
        {description ? <p>{description}</p> : ""}
        <Button name="select-btn">Select</Button>
      </div>
    </MarkerWithLabel>;
  }
}

export default ResultsMarker;