import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CandidatesList from "./CandidatesList";
import Lobby from "./Lobby";

class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/nex" component={Lobby} />
            <Route exact path="/" component={CandidatesList} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
