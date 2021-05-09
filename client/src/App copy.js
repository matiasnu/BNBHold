import React, { Component } from "react";
import { Button } from "semantic-ui-react"
import AntiWallet from "./contracts/AntiWallet.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null };


  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  handleClick = () => {
    console.log('this is:', this);
  }  

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      // Aqui se realiza la carga 'load' del contrato
      let deployedNetwork = AntiWallet.networks[networkId];
      const antiWalletInstance = new web3.eth.Contract(
        AntiWallet.abi,
        deployedNetwork && deployedNetwork.address
      );


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, antiWalletContract: antiWalletInstance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, antiWalletContract } = this.state;

    /*
      Aqui toda la interaccion con el contrato. Obtengo datos del contrato
    */
    PROJECT_FEE
    const PROJECT_FEE = await antiWalletContract.methods.getPROJECT_FEE().call();
    const contractBalanceResponse = await antiWalletContract.methods.getContractBalance().call();
    
    // Update state with the result.
    this.setState({ contractBalance: contractBalanceResponse });
  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">

        <div>
          <Input
            actionPosition="left"
            label="ETH"
            labelPosition="right"
          />
        </div>
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>

        <div>User Dividends: {this.state.contractBalance}</div>

        <div>
          <Button onClick={this.handleClick}>
            Click me to invoque a contract method
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
