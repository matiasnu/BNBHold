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






            // Buena data acerca de Topics
            // https://ethereum.stackexchange.com/questions/12950/what-are-event-topics/12951
            // Me suscribo al evento AliciaEvent del contrato
            // Importante: Los argumentos indexados consumen gas, pero son importantes si uno requiere
            // hacer una busqueda sobre una gran cantidad de eventos o desea filtrar los eventos a traves de
            // filtros en los argumentos
            // console.log("AliciaEvent(uint256,uint256,uint256)", web3.utils.sha3('AliciaEvent(uint256,uint256,uint256)'));

            // var subscription = web3.eth.subscribe('logs', 
            //     {
            //         address: deployedNetwork.address, //Smart contract address
            //         topics: [web3.utils.sha3('AliciaEvent(uint256,uint256,uint256)')]   //topics for events
            //     })
            //     .on("connected", function(subscriptionId){
            //         console.log("subscriptionId:", subscriptionId);
            //     })
            //     .on('changed', function(event){
            //         // remove event from local database
            //         console.log("remove event from local database ", event);
            //     })
            //     .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
            //       console.log("Error en la suscripcion ", error);
            //     })
            //     .on("data", function(event){
            //         console.log("Event:", event);
            //         //Code from here would be run immediately when event appeared
            //         // Imprimo los datos que retorna el objeto del evento
            //         // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#contract-events
            //         //console.log("name", trxData.event);
            //     });






            