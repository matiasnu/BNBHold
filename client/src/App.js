import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { Input, Button, Container, Menu } from "semantic-ui-react";
import  history from "./history";
import { Home } from './components/Home'
import { About } from './components/About'
import { NotFound } from './components/NotFound'

import "./App.css";

class App extends Component {

  render() {

    return (
      <Router history={history}>
        <Container>

          <Menu secondary>
            <Menu.Item
              name='home'
              onClick={this.navigateToHome}
            />
          </Menu>

          <Switch>
            <Route exact path= '/' component={Home} />
            <Route path= '/About' component={About} />
            <Route component={NotFound} />

          </Switch>

        </Container>
      </Router>
    );
  }


  navigateToHome(e){
    e.preventDefault();
    history.push('/');
  }

}

export default App;
