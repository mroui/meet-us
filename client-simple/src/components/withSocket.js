import React from "react";
import * as io from "socket.io-client";

// DK: socket.io initialization has to be outside func call so it won't re-initialize
const socket = io("http://localhost:4000", { path: "/socket" });

export default function withSocket(WrappedComponent) {
  // DK: Overall display names should be handy in debuging RN atleast so keep the rule there too
  // eslint-disable-next-line react/display-name
  return (props) => <WrappedComponent socket={socket} {...props} />;
}