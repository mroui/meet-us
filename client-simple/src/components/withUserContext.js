import React from "react";
import {UserContext} from "../services/userContext";

export default function withUserContext(WrappedComponent) {
  // eslint-disable-next-line react/display-name
  return (props) => (
    <UserContext.Consumer>
      {(context) => <WrappedComponent {...props} context={context}/>}
    </UserContext.Consumer>
  );
}