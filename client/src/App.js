import React, { Component } from "react";
import ThunderHold from "./contracts/ThunderHold.json";
import getWeb3WS from "./getWeb3WS";
import getWeb3Modal from "./getWeb3Modal";

import { Button, Header, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";
import history from "./history";

import "./views/app.css";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    userWallet: "Connect wallet",
    invest: 0,
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3Modal();
      //const web3EventReader = await getWeb3WS();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = ThunderHold.networks[networkId];
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
      web3.eth.personal.unlockAccount(accounts[0], "", 300);

      // Obtengo e imprimo el Balance en Ether de la cuenta principal 'coinBase'
      // Probar con otra cuenta cualquiera que desee el usuario
      /*web3.eth
        .getBalance(accounts[1])
        .then(function (etherBalance) {
          console.log("Ether:", web3.utils.fromWei(etherBalance, "ether"));
        })
        .catch(function (error) {
          console.log("ERROR", error);
        });*/
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: antiWalletContract }, this.updateState);
      // Seteo como estado un objeto state y le agrego un metodo que se ejecuta..
      this.setState(
        {
          web3,
          accounts,
          thunderContract: thunderInstance,
        }
        //this.getContractStatistics
      );

      // Me suscribo a los eventos de interes
      this.setSuscriptions();

      // Obtengo los eventos anterios que ocurrietron. Logicamente estos no cambian el estado actual
      // del contrato y solo sirven para recabar informacion previa
      // Este metodo se debe llamar una vez que esta actualizado el state de la pagina
      this.getPastEvents();
      this.connectWallet();
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
    const { accounts, thunderContract } = this.state;

    //await storageContract.methods.set(5).send({ from: accounts[0] });
    //const storageResponse = await storageContract.methods.get().call();
    const thunderContractResponse = await thunderContract.methods
      .getContractBalance()
      .call();

    // Update state with the result.
    this.setState({
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

    console.log("Account usada para invertir: ", accounts[0]);

    await thunderContract.methods
      .invest("0x94B50Ad34FD502831471B6f5583316820C77B94E", 0)
      .send({
        from: accounts[0],
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
        <div class="address-block"></div>
          <span class="contract-address">Contract address</span>
          <div class="dato6-block"></div>
          <span class="dato6">0X6738D62FFD3436...E16E3</span>
          <div class="address1">
            <span class="total-balance">Total balance</span>
            <span class="contract-balance">{this.state.balanceContract} TT</span>
          </div>
          <div class="address2">
            <span class="total-staked">Total TT staked</span>
            <span class="dato1">50000.1 TT</span>
          </div>

        <div class="plan-block"></div>
          <span class="plan">Plan 1</span>
          <div class="plan1">
            <span class="daily-profit">Daily profit</span>
            <span class="profit-number">35.3%</span>
          </div>
          <div class="plan2">
            <span class="total-return">Total return</span>
            <span class="dato2">706%</span>
          </div>
          <div class="plan3">
            <span class="days">Days</span>
            <span class="dato3">20</span>
          </div>
          <div class="plan4">
            <span class="withdraw-time">Withdraw time</span>
            <span class="every-time">Every 24 hours</span>
          </div>
          <span class="enter-ammount">Enter amount</span>
          <input class="input-value" type="text" value={this.state.invest} onChange={this.onChange} />
          <span class="min-tt">Minimum 500 TT</span>
          <span class="max-tt">Maximum 100000 TT</span>
          <span class="dato5">In 20 days you will get</span>
          <span class="dato4">0,43893494</span>
          <button class="stake" type="button" onClick={this.investContract}>Stake TT</button>

        <div class="data-block"></div>
          <div class="data1"></div>
          <div class="data2"></div>
          <div class="data-numbers">
            <span class="your-total-staked">Your total staked</span>
            <span class="dato27">50000.1 TT</span>
            <span class="total-deposits">Total deposits</span>
            <span class="dato26">50000.1 TT</span>
          </div>
        
        <div class="withdraw-block"></div>
          <div class="data-withdraw-block">
            <span class="total-withdraw">Total withdrawn</span>
            <span class="dato7">50000.1 TT</span>
          </div>
          <button class="withdraw-button"><span class="withdraw">Withdraw</span></button>
        

        <div class="idea-block"></div>
          <span class="idea">Agregado, idea friendly</span>

        <div class="stakes-block"></div>
          <span class="my-stakes">My stakes</span>
          <div class="stake1">
          <div class="stake-check"></div>
            <span class="dato23">83498 TT</span>
            <span class="dato9">560%</span>
            <span class="dato10">01/01/21 - 01/01/21</span>
          </div>
          <div class="stake2">
            <div class="stake-check"></div>
            <span class="dato11">83498 TT</span>
            <span class="dato12">560%</span>
            <span class="dato13">01/01/21 - 01/01/21</span>
          </div>
          <div class="stake3">
          <div class="stake-check"></div>
            <span class="dato20">83498 TT</span>
            <span class="dato24">560%</span>
            <span class="dato25">01/01/21 - 01/01/21</span>
          </div>
          <div class="stake4">
          <div class="stake-check"></div>
            <span class="dato17">83498 TT</span>
            <span class="dato21">560%</span>
            <span class="dato22">01/01/21 - 01/01/21</span>
          </div>
          <div class="stake5">
          <div class="stake-check"></div>
            <span class="dato14">83498 TT</span>
            <span class="dato18">560%</span>
            <span class="dato19">01/01/21 - 01/01/21</span>
          </div>
          <div class="stake6">
          <div class="stake-check"></div>
            <span class="dato8">83498 TT</span>
            <span class="dato15">560%</span>
            <span class="dato16">01/01/21 - 01/01/21</span>
          </div>

        <span class="home">Home</span>
        <span class="lottery">Lottery</span>
        <span class="audit">Audit</span>
        <span class="support">Support</span>
        <span class="presentation">Presentation</span>
        <div class="connect-wallet-block">
          <Button primary onClick={this.componentDidMount}>
            {this.state.userWallet}
          </Button>
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
