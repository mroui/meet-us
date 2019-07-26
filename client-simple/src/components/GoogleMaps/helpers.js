import React from "react";

export const gMapsConfigProps = {
  googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div className="chatrooms-map"/>,
  mapElement: <div style={{ height: `100%` }} />,
};