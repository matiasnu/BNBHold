import React, { Component } from "react";
import ThunderHold from "./contracts/ThunderHold.json";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import { Route, Router, Switch } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';
//import { Campaign } from './components/Campaign';
import { Plan } from './components/Plan';
import { NotFound } from './components/NotFound';
import history from './history';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = SimpleStorageContract.networks[networkId];
      const storageInstance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      deployedNetwork = ThunderHold.networks[networkId];
      const thunderInstance = new web3.eth.Contract(
        ThunderHold.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, storageContract: storageInstance, thunderContract: thunderInstance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  connectWallet = async () => {
    const { accounts, storageContract, thunderContract } = this.state;

    await storageContract.methods.set(5).send({ from: accounts[0] });
    const storageResponse = await storageContract.methods.get().call();

    const thunderContractResponse = await thunderContract.methods.getContractBalance().call();

    // Update state with the result.
    this.setState({ balanceContract: thunderContractResponse });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Router history={history}>
          <Container>
            <Menu secondary>
              <Menu.Item name='home' onClick={this.navigateToHome} />
            </Menu>
            <Switch>
              <Route exact path='/' component={Plan} />
              {/* <Route path='/campaing:address' component={Campaign} /> */}
              <Route component={NotFound} />
            </Switch>
          </Container>
        </Router>
        <Button onClick={this.connectWallet}>Connect wallet</Button>
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>The contract balance response is: {this.state.balanceContract}</div>
      </div>
    );
  }

  navigateToHome(e){
    e.preventDefault();
    history.push('/');
  }
}

export default App;
