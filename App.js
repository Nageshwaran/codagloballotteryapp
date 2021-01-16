import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CandidatesList from "./CandidatesList";
import Lobby from "./Lobby";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      userListfilter: [],
      shortList: [],
      rejected: []
    };
  }

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
