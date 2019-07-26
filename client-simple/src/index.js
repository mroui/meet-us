import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import AppRouter from "./AppRouter";
import apolloClient from "./services/apollo";
import { UserProvider } from "./services/userContext";
import "../src/styles/index.scss";

// Apollo Client
ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <UserProvider>
      <AppRouter/>
    </UserProvider>
  </ApolloProvider>,
  document.getElementById("root")
);
