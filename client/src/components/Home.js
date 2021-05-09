import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react"
import AntiWallet from "./../contracts/AntiWallet.json";
import getWeb3 from "./../getWeb3";

import "./../App.css";

export class Home extends Component {

    state = { web3: null, accounts: null, contract: null };


    // This syntax ensures `this` is bound within handleClick.
    // Warning: this is *experimental* syntax.
    fOnClick = async () => {

        console.log('fOnClick');

        //const { accounts, contract } = this.state;
        const { accounts} = this.state;

        // try{

        //     /*
        //     Invoque alice() function to emit an event
        //     */
        //     const resultadoFuncionEvento = await contract.methods.alice(3,2).call();
        //     console.log('resultadoFuncionEvento ', resultadoFuncionEvento);

        // } catch (error) {
        //     // Catch any errors for any of the above operations.
        //     alert(
        //         `Failed to load web3, accounts, or contract. Check console for details.`,);
        //     console.error(error);
        // }


    };
   

    componentDidMount = async () => {
         
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            console.log(web3);

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            console.log("networkId ", networkId);


            // Para poder utilizar una cuenta debo desbloquearla
            web3.eth.personal.unlockAccount(accounts[0], "", 300);

            // Obtengo e imprimo el Balance en Ether de la cuenta principal coinBase
            // Probar con otra cuenta cualquiera que desee el usuario
            web3.eth.getBalance(accounts[0])
                .then(function (etherBalance) {
                    console.log('Ether:', web3.utils.fromWei(etherBalance, 'ether'));
                })
                .catch(function (error) {
                    console.log("ERROR", error);
                });


            // Aqui se realiza la carga 'load' del contrato
            // Si el contrato no esta desplegado, esta seccion del codigo va a dar error
            // Quiza sea una buena idea agregar el codigo necesario para chequear si el contrato (1 instancia) esta instanciado
            // Estas lineas leen el JSON asociado al contrato subyacente
            let deployedNetwork = AntiWallet.networks[networkId];
            const antiWalletContract = new web3.eth.Contract(
                AntiWallet.abi,
                deployedNetwork && deployedNetwork.address
            );
            // console.log("Direccion del contrato ", deployedNetwork.address);
            // console.log("Datos del contrato ", AntiWallet);

            // Quiero registrar una funcion async recurrente que pueda obtener determinados eventos
            // de un contrato y registrarlos para uso del frontend
            // Esta forma de obtener los eventos no suscribe a nuevos eventos y es necesario suscribirse
            // con el metodo subscribe
            // let events = await antiWalletContract.getPastEvents('Const', {
            //     // El evento se puede denominar puntualmente o se pueden traer todos los eventos
            //     // utilizando 'allEvents'. Se podria combinar el 'allEvents' con un switch.
            //     filter: { }, // Este parametro es opcional
            //     fromBlock: 0, // Este parametro es opcional
            //     // fromBlock: web3.eth.getBlockNumber() // si deseo tomar solo los nuevos eventos desde
            //     // que se inicio esta session
            //     // Otra opcion es registrar el Bloque con el cual se creo el contrato y usarlo como cota inferior
            //     toBlock: 'latest' // Este parametro es opcional
            // }, (error, events) => {
            //     if (!error) {
            //         var obj = JSON.parse(JSON.stringify(events));
            //         console.log("returned values1 ", obj);
            //         var array = Object.keys(obj)
            //         console.log("returned values", obj[array[0]].returnValues);
            //     }
            //     else {
            //         console.log(error)
            //     }
            // });

            // Buena data acerca de Topics
            // https://ethereum.stackexchange.com/questions/12950/what-are-event-topics/12951
            var subscription = web3.eth.subscribe('logs', 
                {
                    address: deployedNetwork.address, //Smart contract address
                    //topics: [web3.utils.keccak256('AliciaEvent(uint256,uint256)')]   //topics for events
                    topics: [web3.utils.sha3('AliciaEvent(uint256,uint256)')]   //topics for events
                }, function(error, result){
                    if (error) console.log(error);
                    else {
                        console.log(result);
                        alert('Evento');
                    }
                }).on("data", function(trxData){
                    console.log("Event received", trxData);
                    alert('Evento');
                    //Code from here would be run immediately when event appeared
                }).on("changed", function(trxData){
                    console.log("Event received", trxData);
                    alert('Evento');
                }
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            //this.setState({ web3, accounts, contract: antiWalletContract }, this.updateState);
            this.setState({ web3, accounts }, this.updateState);

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };


    updateState = async () => {
        //const { accounts, contract } = this.state;
        const { accounts } = this.state;

        /*
          Aqui toda la interaccion con el contrato. Obtengo datos del contrato
        */

        /*
        GET USER CONSTANTS
        */
        // const INVEST_MIN_AMOUNT = await contract.methods.INVEST_MIN_AMOUNT().call();
        // const INVEST_MAX_AMOUNT = await contract.methods.INVEST_MAX_AMOUNT().call();
        // const PROJECT_FEE = await contract.methods.PROJECT_FEE().call();
        // const PERCENT_STEP = await contract.methods.PERCENT_STEP().call();
        // const PERCENTS_DIVIDER = await contract.methods.PERCENTS_DIVIDER().call();
        // const PROJECTIME_STEPT_FEE = await contract.methods.TIME_STEP().call();
        /*
        GET USER VARIABLES
        */

        // const totalStaked = await contract.methods.totalStaked().call();
        // const totalRefBonus = await contract.methods.totalRefBonus().call();
        // const startUNIX = await contract.methods.startUNIX().call();

        /*
        GET VARIABLES FROM THE RAW CONTRACT
        */
        // const contractBalance = await contract.methods.getContractBalance().call();


        /*
        Invoque alice() function to emit an event
        */
        // const resultadoFuncionEvento = await contract.methods.alice(3,2).call();
        // console.log('resultadoFuncionEvento ', resultadoFuncionEvento);

        // Update state with the result.
        //this.setState({ contractBalance: contractBalance });
        this.setState({ });
    };

    render() {
        return (
            <div className="App">

                <h1>Good to Go!</h1>
                <p>Your Truffle Box is installed and ready.</p>
                <h2>Smart Contract Example</h2>

                <div>User Dividends: {this.state.contractBalance}</div>
                <div>
                    <Button onClick={async () => { await this.fOnClick();} }>
                        Click me to invoque a contract method
                    </Button>
                </div>


            </div>
        );
    }


 }