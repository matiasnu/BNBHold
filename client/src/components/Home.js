import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react"
import AntiWallet from "./../contracts/AntiWallet.json";
import getWeb3 from "./../getWeb3";

import "./../App.css";

export class Home extends Component {

    state = { web3: null, accounts: null, contract: null };
   

    componentDidMount = async () => {
         
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            console.log("networkId ", networkId);

            // Aqui se realiza la carga 'load' del contrato
            let deployedNetwork = AntiWallet.networks[networkId];
            const antiWalletContract = new web3.eth.Contract(
                AntiWallet.abi,
                deployedNetwork && deployedNetwork.address
            );
            console.log("Direccion del contrato ", deployedNetwork.address);

            // Quiero registrar una funcion async recurrente que pueda obtener determinados eventos
            // de un contrato y registrarlos para uso del fe

            let events = await antiWalletContract.getPastEvents('Const', {
                // El evento se puede denominar puntualmente o se pueden traer todos los eventos
                // utilizando 'allEvents'. Se podria combinar el 'allEvents' con un switch.
                filter: { }, // Este parametro es opcional
                fromBlock: 0, // Este parametro es opcional
                // fromBlock: web3.eth.getBlockNumber() // si deseo tomar solo los nuevos eventos desde
                // que se inicio esta session
                // Otra opcion es registrar el Bloque con el cual se creo el contrato y usarlo como cota inferior
                toBlock: 'latest' // Este parametro es opcional
            }, (error, events) => {
                if (!error) {
                    var obj = JSON.parse(JSON.stringify(events));
                    console.log("returned values1 ", obj);
                    var array = Object.keys(obj)
                    console.log("returned values", obj[array[0]].returnValues);
                }
                else {
                    console.log(error)
                }
            });


            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: antiWalletContract }, this.updateState);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };


    updateState = async () => {
        const { accounts, contract } = this.state;

        /*
          Aqui toda la interaccion con el contrato. Obtengo datos del contrato
        */

        /*
        GET USER CONSTANTS
        */
        const INVEST_MIN_AMOUNT = await contract.methods.INVEST_MIN_AMOUNT().call();
        const INVEST_MAX_AMOUNT = await contract.methods.INVEST_MAX_AMOUNT().call();
        const PROJECT_FEE = await contract.methods.PROJECT_FEE().call();
        const PERCENT_STEP = await contract.methods.PERCENT_STEP().call();
        const PERCENTS_DIVIDER = await contract.methods.PERCENTS_DIVIDER().call();
        const PROJECTIME_STEPT_FEE = await contract.methods.TIME_STEP().call();
        /*
        GET USER VARIABLES
        */

        const totalStaked = await contract.methods.totalStaked().call();
        const totalRefBonus = await contract.methods.totalRefBonus().call();
        const startUNIX = await contract.methods.startUNIX().call();

        /*
        GET VARIABLES FROM THE RAW CONTRACT
        */
        const contractBalance = await contract.methods.getContractBalance().call();


        // Update state with the result.
        this.setState({ contractBalance: contractBalance });
    };

    render() {
        return (
            <div className="App">

                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>

                <div>User Dividends: {this.state.contractBalance}</div>

            </div>
        );
    }


 }