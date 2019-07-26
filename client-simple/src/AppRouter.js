import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import CreateChannel from "./pages/CreateChannel";

class AppRouter extends Component {
  render() {
    return (
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/chat/:chatId" exact component={Chat} />
        <Route path="/create" exact component={CreateChannel} />
      </Router>
    );
  }
}

export default AppRouter;
