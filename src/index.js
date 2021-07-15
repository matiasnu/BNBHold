import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Lottery } from "./components/Lottery";
import { NotFound } from "./components/NotFound";
import Stats from "./components/Stats";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "semantic-ui-react";
import getChat from "./components/Chat";

//ReactDOM.render(<App />, document.getElementById('root'));

ReactDOM.render(
  <Router>
    <Container>
      <Switch>
        <Route exact path="/" component={App}></Route>
        {/* <Route exact path="/lottery" component={Lottery}></Route>  Ya se añade la lottery como component en el Home*/}
        <Route exact path="/chat" component={getChat}></Route>
        <Route exact path="/stats" component={Stats}></Route>
        <Route component={NotFound} />
      </Switch>
    </Container>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
