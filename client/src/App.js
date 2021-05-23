import React, { Component } from "react";
import ThunderHold from "./contracts/ThunderHold.json";
import getWeb3WS from "./getWeb3WS";
import getWeb3Modal from "./getWeb3Modal";

import { Button, Header, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";
import history from "./history";

import "./views/app.css";
import logo from "./views/images/logo.png";

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
      // const web3EventReader = await Web3Modal();
      // console.log("web3EventReader-->", web3EventReader);

      // Get network provider and web3 instance.
      const web3 = await getWeb3Modal();
      //console.log("web3-->", web3);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      let deployedNetwork = ThunderHold.networks[networkId];
      const thunderInstance = new web3.eth.Contract(
        ThunderHold.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.onChange = this.onChange.bind(this);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({
      //   web3,
      //   accounts,
      //   storageContract: storageInstance,
      //   thunderContract: thunderInstance,
      // });
      // Para poder utilizar una cuenta debo desbloquearla por un tiempo determinado
      // web3.eth.personal.unlockAccount(accounts[0], "", 300);
      // console.log("Wallet a utilizar: ", accounts[0]);

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
      this.setState({
        web3,
        accounts,
        thunderContract: thunderInstance,
      });

      // Me suscribo a los eventos de interes
      this.setSuscriptions();

      this.getContractStatistics();

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
        console.log("event Newbie arrived");
        console.log(event.returnValues);
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
        console.log("event NewDeposit arrived");
        console.log(event.returnValues);
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
        console.log("event Withdrawn arrived");
        console.log(event.returnValues);

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
        console.log("event RefBonus arrived");
        console.log(event.returnValues);

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
        console.log("event NewParticipantLotto arrived");
        console.log(event.returnValues);
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
    const { accounts, thunderContract } = this.state;

    // Esta forma de obtener los eventos no suscribe a nuevos eventos y es necesario suscribirse
    // con el metodo subscribe
    // Sumando este monto puedo saber cuanta es la cantidad total de TT que fue retirado hasta este preciso momento
    // Pienso que no es taqn importante la precicion de este valor...
    console.log("getPastEvents.NewDeposits");
    let events = thunderContract.getPastEvents(
      "NewDeposit",
      {
        // El evento se puede denominar puntualmente o se pueden traer todos los eventos pasados
        // utilizando 'allEvents'. Se podria combinar el 'allEvents' con un switch.
        filter: {}, // Este parametro es opcional, en este caso no voy a filtrar nada
        fromBlock: 0, // Este parametro es opcional. Como lo llamo una unica vez, cuando se refrezca la
        // pagina, obtendo todos los eventos pasados de un
        // fromBlock: web3.eth.getBlockNumber() // si deseo tomar solo los nuevos eventos desde
        // que se inicio esta session del usuario. Cuando el usuario refrezque la pagina se vuelve a cargar
        // Otra opcion es registrar el Bloque con el cual se creo el contrato y usarlo como cota inferior
        toBlock: "latest", // Este parametro es opcional
      },
      (error, events) => {
        if (!error) {
          var obj = JSON.parse(JSON.stringify(events));
          var array = Object.keys(obj);

          // Itero por el array imprimiendo los distintos past eventos
          var i = 0;
          for (i = 0; i < array.length; i++) {
            console.log(obj[array[i]].returnValues);
          }
        } else {
          console.log(error);
        }
      }
    );

    console.log("getPastEvents.RefBonus");
    let eventsRefBonus = thunderContract.getPastEvents(
      "RefBonus",
      {
        // El evento se puede denominar puntualmente o se pueden traer todos los eventos pasados
        // utilizando 'allEvents'. Se podria combinar el 'allEvents' con un switch.
        filter: {}, // Este parametro es opcional, en este caso no voy a filtrar nada
        fromBlock: 0, // Este parametro es opcional. Como lo llamo una unica vez, cuando se refrezca la
        // pagina, obtendo todos los eventos pasados de un
        // fromBlock: web3.eth.getBlockNumber() // si deseo tomar solo los nuevos eventos desde
        // que se inicio esta session del usuario. Cuando el usuario refrezque la pagina se vuelve a cargar
        // Otra opcion es registrar el Bloque con el cual se creo el contrato y usarlo como cota inferior
        toBlock: "latest", // Este parametro es opcional
      },
      (error, events) => {
        if (!error) {
          var obj = JSON.parse(JSON.stringify(events));
          var array = Object.keys(obj);

          // Itero por el array imprimiendo los distintos past eventos
          var i = 0;
          for (i = 0; i < array.length; i++) {
            console.log(obj[array[i]].returnValues);
          }
        } else {
          console.log(error);
        }
      }
    );
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
        gas: 500000,
      });
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }

    return (
      <div className="App">
        <div className="dashboard"></div>
          <div className="logo-dashboard"></div>
          <div className="logos-dashboard">
            <div className="home-logo"></div>
          </div>
          <span className="home">Home</span>
          <span className="lottery">Lottery</span>
          <span className="audit">Audit</span>
          <span className="support">Support</span>
          <span className="presentation">Presentation</span>
          <div className="connect-wallet-block">
            <div className="connect-wallet-logo"></div>
            <Button primary onClick={this.componentDidMount}>
              {this.state.userWallet}
            </Button>
          </div>
          <span className="input-group-btn">
            <Link to="/chat">ChatRoom</Link>
          </span>

        <div className="address-block"></div>
        <span className="contract-address">Contract address</span>
        <div className="dato6-block">
          <span className="dato6">0X6738D62FFD3436...E16E3</span>
          <div className="contract-address-logo"></div>
        </div>
        <div className="address1">
          <span className="total-balance">Total balance</span>
          <span className="contract-balance">
            {this.state.balanceContract} TT
          </span>
        </div>
        <div className="address2">
          <span className="total-staked">Total TT staked</span>
          <span className="dato1">50000.1 TT</span>
        </div>

        <div className="plan-block"></div>
        <span className="plan">Plan 1</span>
        <div className="plan1">
          <span className="daily-profit">Daily profit</span>
          <span className="profit-number">35.3%</span>
        </div>
        <div className="plan2">
          <span className="total-return">Total return</span>
          <span className="dato2">706%</span>
        </div>
        <div className="plan3">
          <span className="days">Days</span>
          <span className="dato3">20</span>
        </div>
        <div className="plan4">
          <span className="withdraw-time">Withdraw time</span>
          <span className="every-time">Every 24 hours</span>
        </div>
        <span className="enter-ammount">Enter amount</span>
        <input
          className="input-value"
          type="text"
          value={this.state.invest}
          onChange={this.onChange}
        />
        <span className="min-tt">Minimum 500 TT</span>
        <span className="max-tt">Maximum 100000 TT</span>
        <span className="dato5">In 20 days you will get</span>
        <span className="dato4">0,43893494</span>
        <button className="stake" type="button" onClick={this.investContract}>
          Stake TT
        </button>

        <div className="data-block"></div>
        <div className="data1"></div>
        <div className="data2"></div>
        <div className="data-numbers">
          <span className="your-total-staked">Your total staked</span>
          <span className="dato27">50000.1 TT</span>
          <span className="total-deposits">Total deposits</span>
          <span className="dato26">50000.1 TT</span>
        </div>

        <div className="withdraw-block"></div>
        <div className="data-withdraw-block">
          <span className="total-withdraw">Total withdrawn</span>
          <span className="dato7">50000.1 TT</span>
        </div>
        <button className="withdraw-button">
          <span className="withdraw">Withdraw</span>
        </button>

        <div className="idea-block"></div>
        <div className="pinguino-logo"></div>
        <span className="idea">Agregado</span>

        <div className="stakes-block"></div>
        <span className="my-stakes">My stakes</span>
        <div className="stake1">
          <div className="stake-check"></div>
          <span className="dato23">83498 TT</span>
          <span className="dato9">560%</span>
          <span className="dato10">01/01/21 - 01/01/21</span>
        </div>
        <div className="stake2">
          <div className="stake-check"></div>
          <span className="dato11">83498 TT</span>
          <span className="dato12">560%</span>
          <span className="dato13">01/01/21 - 01/01/21</span>
        </div>
        <div className="stake3">
          <div className="stake-check"></div>
          <span className="dato20">83498 TT</span>
          <span className="dato24">560%</span>
          <span className="dato25">01/01/21 - 01/01/21</span>
        </div>
        <div className="stake4">
          <div className="stake-check"></div>
          <span className="dato17">83498 TT</span>
          <span className="dato21">560%</span>
          <span className="dato22">01/01/21 - 01/01/21</span>
        </div>
        <div className="stake5">
          <div className="stake-check"></div>
          <span className="dato14">83498 TT</span>
          <span className="dato18">560%</span>
          <span className="dato19">01/01/21 - 01/01/21</span>
        </div>
        <div className="stake6">
          <div className="stake-check"></div>
          <span className="dato8">83498 TT</span>
          <span className="dato15">560%</span>
          <span className="dato16">01/01/21 - 01/01/21</span>
        </div>
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
