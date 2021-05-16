import React, { Component } from "react";
import ThunderHold from "./contracts/ThunderHold.json";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb from "./getWeb3";

import { Button, Header, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";
import history from "./history";

import "./App.css";

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    accounts: null,
    contract: null,
    userWallet: "Connect wallet",
    invest: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      //const web3 = await getWeb3Modal();
      const web3 = await getWeb();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = SimpleStorageContract.networks[networkId];
      const storageInstance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      deployedNetwork = ThunderHold.networks[networkId];
      const thunderInstance = new web3.eth.Contract(
        ThunderHold.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.onChange = this.onChange.bind(this);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({
      //   web3,
      //   accounts,
      //   storageContract: storageInstance,
      //   thunderContract: thunderInstance,
      // });
      // Para poder utilizar una cuenta debo desbloquearla por un tiempo determinado
      web3.eth.personal.unlockAccount(accounts[1], "", 300);

      // Obtengo e imprimo el Balance en Ether de la cuenta principal 'coinBase'
      // Probar con otra cuenta cualquiera que desee el usuario
      web3.eth
        .getBalance(accounts[1])
        .then(function (etherBalance) {
          console.log("Ether:", web3.utils.fromWei(etherBalance, "ether"));
        })
        .catch(function (error) {
          console.log("ERROR", error);
        });
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: antiWalletContract }, this.updateState);
      // Seteo como estado un objeto state y le agrego un metodo que se ejecuta..
      this.setState(
        {
          web3,
          accounts,
          storageContract: storageInstance,
          thunderContract: thunderInstance,
        },
        this.getContractStatistics
      );

      // Me suscribo a los eventos de interes
      this.setSuscriptions();

      // Obtengo los eventos anterios que ocurrietron. Logicamente estos no cambian el estado actual
      // del contrato y solo sirven para recabar informacion previa
      // Este metodo se debe llamar una vez que esta actualizado el state de la pagina
      this.getPastEvents();

      // this.connectWallet();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  /*
        setSuscriptions: Setea las suscripciones a eventos de contrato
    */
  setSuscriptions = async () => {
    const { thunderContract } = this.state;

    // Me suscribo al evento Newbie
    thunderContract.events
      .Newbie()
      .on("data", function (event) {
        console.log("event:", event.returnValues.res); // same results as the optional callback above
        //alert(event.returnValues.res);
      })
      .on("changed", function (event) {
        // remove event from local database
      })
      .on("error", console.error);

    // Me suscribo al evento NewDeposit
    thunderContract.events
      .NewDeposit()
      .on("data", function (event) {
        console.log("event:", event.returnValues.res); // same results as the optional callback above
        //alert(event.returnValues.res);
      })
      .on("changed", function (event) {
        // remove event from local database
      })
      .on("error", console.error);

    // Me suscribo al evento Withdrawn
    thunderContract.events
      .Withdrawn()
      .on("data", function (event) {
        console.log("event:", event.returnValues.res); // same results as the optional callback above
        //alert(event.returnValues.res);
      })
      .on("changed", function (event) {
        // remove event from local database
      })
      .on("error", console.error);

    // Me suscribo al evento RefBonus
    thunderContract.events
      .RefBonus()
      .on("data", function (event) {
        console.log("event:", event.returnValues.res); // same results as the optional callback above
        //alert(event.returnValues.res);
      })
      .on("changed", function (event) {
        // remove event from local database
      })
      .on("error", console.error);

    // Me suscribo al evento NewParticipantLotto
    thunderContract.events
      .NewParticipantLotto()
      .on("data", function (event) {
        console.log("event:", event.returnValues.res); // same results as the optional callback above
        //alert(event.returnValues.res);
      })
      .on("changed", function (event) {
        // remove event from local database
      })
      .on("error", console.error);
  };

  /*
              getPastEvents: Obtiene la data de eventos que ya ocurrieron en el contrato
          */
  getPastEvents = async () => {
    console.log("getPastEvents");

    const { accounts, contract } = this.state;

    // Esta forma de obtener los eventos no suscribe a nuevos eventos y es necesario suscribirse
    // con el metodo subscribe
    // let events = contract.getPastEvents(
    //   "AliciaEvent",
    //   {
    //     // El evento se puede denominar puntualmente o se pueden traer todos los eventos pasados
    //     // utilizando 'allEvents'. Se podria combinar el 'allEvents' con un switch.
    //     filter: {}, // Este parametro es opcional, en este caso no voy a filtrar nada
    //     fromBlock: 0, // Este parametro es opcional. Como lo llamo una unica vez, cuando se refrezca la
    //     // pagina, obtendo todos los eventos pasados de un
    //     // fromBlock: web3.eth.getBlockNumber() // si deseo tomar solo los nuevos eventos desde
    //     // que se inicio esta session del usuario. Cuando el usuario refrezque la pagina se vuelve a cargar
    //     // Otra opcion es registrar el Bloque con el cual se creo el contrato y usarlo como cota inferior
    //     toBlock: "latest", // Este parametro es opcional
    //   },
    //   (error, events) => {
    //     if (!error) {
    //       var obj = JSON.parse(JSON.stringify(events));
    //       var array = Object.keys(obj);

    //       // Itero por el array imprimiendo los distintos past eventos
    //       var i = 0;
    //       for (i = 0; i < array.length; i++) {
    //         console.log(obj[array[i]].returnValues);
    //       }

    //       console.log(obj);
    //       console.log(array);
    //     } else {
    //       console.log(error);
    //     }
    //   }
    // );
  };

  /*
     getContractStatistics: Obtiene la data actualizada del estado del contrato
  */
  getContractStatistics = async () => {
    const { accounts, thunderContract } = this.state;

    /*
       Aqui toda la interaccion con el contrato. Obtengo las estadisticas actuales del contrato
    */
    /*
     GET USER CONSTANTS
    */
    const INVEST_MIN_AMOUNT = await thunderContract.methods
      .INVEST_MIN_AMOUNT()
      .call();

    /*
      GET USER VARIABLES
    */
    const totalStaked = await thunderContract.methods.totalStaked().call();
    const totalRefBonus = await thunderContract.methods.totalRefBonus().call();
    const startUNIX = await thunderContract.methods.startUNIX().call();

    /*
      GET VARIABLES FROM THE RAW CONTRACT
    */
    const contractBalance = await thunderContract.methods
      .getContractBalance()
      .call();

    // Update state with the result.
    // Setear un valor en el contrato, que no reemplaza un nombre previo, logra apendear el nuevo
    // valor a la lista de valores del estado sin cambiar datos anteriores
    this.setState({
      contractBalance: contractBalance,
      totalStaked: totalStaked,
      totalRefBonus: totalRefBonus,
    });
  };

  connectWallet = async () => {
    const { accounts, storageContract, thunderContract } = this.state;

    //await storageContract.methods.set(5).send({ from: accounts[0] });
    const storageResponse = await storageContract.methods.get().call();
    const thunderContractResponse = await thunderContract.methods
      .getContractBalance()
      .call();

    // Update state with the result.
    this.setState({
      storageValue: storageResponse,
      balanceContract: thunderContractResponse,
      userWallet: accounts[0],
    });
  };

  getDataToContract = async () => {
    // Get data to the contract.
    //const thunderContractResponse = await thunderContract.methods.getPlanInfo(1).call();
  };

  investContract = async () => {
    const { accounts, thunderContract } = this.state;

    console.log("Account usada para invertir: ", accounts[1]);

    await thunderContract.methods
      .invest("0x94B50Ad34FD502831471B6f5583316820C77B94E", 0)
      .send({
        from: accounts[1],
        value: this.state.invest,
        gas: 3000000,
      });
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div className="App">
        <div>
          <Header as="h1">Plan 1</Header>
          <Input
            label="Contract Address"
            type="text"
            value={this.state.invest}
            onChange={this.onChange}
          />
          <Button primary type="submit" onClick={this.investContract}>
            Stake TT
          </Button>
        </div>
        <Button onClick={this.componentDidMount}>
          {this.state.userWallet}
        </Button>
        <h2>Smart Contract Example</h2>
        <div>The stored value is: {this.state.storageValue}</div>
        <div>
          The contract balance response is: {this.state.balanceContract}
        </div>
        <span className="input-group-btn">
          <Link to="/chat">ChatRoom</Link>
        </span>
      </div>
    );
  }

  navigateToHome(e) {
    e.preventDefault();
    history.push("/");
  }

  onChange(event) {
    this.setState({ invest: event.target.value });
  }
}

export default App;
