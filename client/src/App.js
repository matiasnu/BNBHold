import React, { Component } from "react";
import ThunderHold from "./contracts/ThunderHold.json";
import getWeb3Modal from "./getWeb3Modal";

import { Button, Header, Input } from "semantic-ui-react";
import { Link } from "react-router-dom";
import history from "./history";
import { Lottery } from "./components/Lottery";

import "./views/app.css";
import coonectWalletLogo from "./views/images/connect-wallet-dashboard.png";

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    userWallet: "Connect wallet",
    invest: 0,
    isLotteryVisible: false,
    isHomeVisible: false,
    parsedWallet: null, // wallet parseada para mostrar en la pantalla (lease truncada con puntos)
    totalStaked: 0,
    contractBalance: 0,
  };

  componentDidMount = async () => {
    try {
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
        parsedWallet:
          accounts[0].substring(1, 18) + "..." + accounts[0].substring(36), // Ejemplo wallet: 0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0 (42 posiciones)
      });

      // Me suscribo a los eventos de interes
      this.setSuscriptions();

      this.getContractStatistics();

      // Obtengo los eventos anterios que ocurrietron. Logicamente estos no cambian el estado actual
      // del contrato y solo sirven para recabar informacion previa
      // Este metodo se debe llamar una vez que esta actualizado el state de la pagina
      this.getPastEvents();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

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
        // console.log("event RefBonus arrived");
        // console.log(event.returnValues);
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
          // var i = 0;
          // for (i = 0; i < array.length; i++) {
          //   console.log(obj[array[i]].returnValues);
          // }
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
          // var i = 0;
          // for (i = 0; i < array.length; i++) {
          //   console.log(obj[array[i]].returnValues);
          // }
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
    const { accounts, thunderContract, web3 } = this.state;

    /*
       Aqui toda la interaccion con el contrato. Obtengo las estadisticas actuales del contrato
    */
    /*
     GET CONTRACT CONSTANTS AND SETTINGS
    */
    const INVEST_MIN_AMOUNT = await thunderContract.methods
      .INVEST_MIN_AMOUNT()
      .call();
    const INVEST_MAX_AMOUNT = await thunderContract.methods
      .INVEST_MAX_AMOUNT()
      .call();

    const totalRefBonus = await thunderContract.methods.totalRefBonus().call();
    const startUNIX = await thunderContract.methods.startUNIX().call();

    /*
      GET USER VARIABLES
    */
    let totalStaked = await thunderContract.methods.totalStaked().call();
    if (totalStaked) {
      totalStaked = web3.utils.fromWei(totalStaked);
      console.log("totalStaked:", totalStaked);
    }
    let contractBalance = await thunderContract.methods
      .getContractBalance()
      .call();
    if (contractBalance) {
      contractBalance = web3.utils.fromWei(contractBalance);
      console.log("contractBalance:", contractBalance);
    }

    // Obtengo la cantidad de stakes o depositos del usuario
    let userStakesAmount = await thunderContract.methods
      .getUserAmountOfDeposits(accounts[0])
      .call();
    if (userStakesAmount) {
      console.log("userStakesAmount:", userStakesAmount);
    }

    // Obtengo getUserTotalDeposits
    let getUserTotalDeposits = await thunderContract.methods
      .getUserTotalDeposits(accounts[0])
      .call();
    if (getUserTotalDeposits) {
      getUserTotalDeposits = web3.utils.fromWei(getUserTotalDeposits);
      console.log("getUserTotalDeposits:", getUserTotalDeposits);
    }

    // Obtengo todos los depositos del usuario y la informacion asociada
    let userDepositsInfo = [];
    for (var indice = 0; indice < userStakesAmount; indice++) {
      userDepositsInfo[indice] = await thunderContract.methods
        .getUserDepositInfo(accounts[0], parseInt(indice))
        .call();
      if (userDepositsInfo[indice].amount) {
        userDepositsInfo[indice].amount = web3.utils.fromWei(
          userDepositsInfo[indice].amount
        );
      }
      if (userDepositsInfo[indice].start && userDepositsInfo[indice].finish) {
        var startDate = new Date(userDepositsInfo[indice].start * 1000);
        var finishDate = new Date(userDepositsInfo[indice].finish * 1000);
        userDepositsInfo[indice].start =
          startDate.getDate() +
          "/" +
          (startDate.getMonth() + 1) +
          "/" +
          startDate.getFullYear() +
          " " +
          startDate.getHours() +
          ":" +
          startDate.getMinutes() +
          ":" +
          startDate.getSeconds();
        userDepositsInfo[indice].finish =
          finishDate.getDate() +
          "/" +
          (finishDate.getMonth() + 1) +
          "/" +
          finishDate.getFullYear() +
          " " +
          finishDate.getHours() +
          ":" +
          finishDate.getMinutes() +
          ":" +
          finishDate.getSeconds();
      }
      if (userDepositsInfo[indice].percent) {
        var percentFormated = (
          Math.round(userDepositsInfo[indice].percent) / 100
        ).toFixed(2);
        console.log(percentFormated);
        userDepositsInfo[indice].percent = percentFormated;
      }
    }

    // Imprimo lo que viene en el Array desde el contrato, que es un Array (Object) de Objects
    console.log(userDepositsInfo);

    // Update state with the result.
    // Setear un valor en el contrato, que no reemplaza un nombre previo, logra apendear el nuevo
    // valor a la lista de valores del estado sin cambiar datos anteriores
    this.setState({
      INVEST_MIN_AMOUNT: INVEST_MIN_AMOUNT,
      INVEST_MAX_AMOUNT: INVEST_MAX_AMOUNT,
      contractBalance: contractBalance,
      totalStaked: totalStaked,
      totalRefBonus: totalRefBonus,
      userStakesAmount: userStakesAmount,
      userDepositsInfo: userDepositsInfo,
    });
  };

  getDataToContract = async () => {
    // Get data to the contract.
    //const thunderContractResponse = await thunderContract.methods.getPlanInfo(1).call();
  };

  investContract = async () => {
    const { web3, accounts, thunderContract, invest } = this.state;

    console.log("Account usada para invertir: ", accounts[0]);
    console.log("Valor a invertir: ", invest);

    const valueToWei = web3.utils.toWei(invest, "ether");
    console.log("valueToWei:", valueToWei);

    await thunderContract.methods
      .invest("0x94B50Ad34FD502831471B6f5583316820C77B94E", 0)
      .send({
        from: accounts[0],
        value: valueToWei,
        gas: 500000,
      });

    // Actualizo el estado del contrato
    this.getContractStatistics();
  };

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }

    // En este if se deberia sacar si la inversion termino o no para mostrarla en my stakes correctamente

    var myStakeCheckSuccess = (
      <React.Fragment>
        <div className="stake-check-success"></div>
        <div className="stake-check-logo-success"></div>
      </React.Fragment>
    );
    var myStakeCheckInProgress = (
      <React.Fragment>
        <div className="stake-check-in-progress"></div>
        <div className="stake-check-logo-in-progress"></div>
      </React.Fragment>
    );

    if (true) {
      var my_stake_check = myStakeCheckSuccess;
    } else {
      my_stake_check = myStakeCheckInProgress;
    }

    var dashboardVisible = (
      <React.Fragment>
        <div className="address-block"></div>
        <span className="contract-address">Contract address</span>
        <div className="dato6-block">
          <span className="dato6">{this.state.parsedWallet}</span>
          <div className="contract-address-logo"></div>
        </div>
        <div className="address1">
          <span className="total-balance">Total balance</span>
          <span className="contract-balance">
            {this.state.contractBalance} TT
          </span>
        </div>
        <div className="address2">
          <span className="total-staked">Total TT staked</span>
          <span className="dato1">{this.state.totalStaked} TT</span>
          {/*<span className="dato1">50000.1 TT</span>*/}
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
          type="number"
          value={this.state.invest}
          onChange={this.onChange}
        />
        <span className="min-tt">Minimum 500 TT</span>
        <span className="max-tt">Maximum 100000 TT</span>
        <span className="dato5">In 20 days you will get</span>
        <span className="dato4">0,43893494</span>
        <button className="stake" type="button" onClick={this.investContract}>
          <span className="stake-snap">Stake TT</span>
        </button>
        <div className="data-block"></div>
        <div className="data1"></div>
        <div className="data2"></div>
        <div className="your-total-stake-logo"></div>
        <div className="total-deposits-logo"></div>
        <div className="data-numbers">
          <span className="your-total-staked">Your total staked</span>
          {/*<span className="dato27">50000.1 TT</span>*/}
          <span className="dato27">{this.state.totalStaked} TT</span>
          <span className="total-deposits">Total deposits</span>
          <span className="dato26">{this.state.userStakesAmount}</span>
          {/*<span className="dato26">50000.1 TT</span>*/}
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

        {this.state.userDepositsInfo
          ? this.state.userDepositsInfo.map((data, index) => {
              return (
                <div key={index}>
                  <div className={"stake" + (index + 1).toString()}>
                    {my_stake_check}
                    <div className="stake-check-in-progress"></div>
                    <div className="stake-check-logo-in-progress"></div>
                    <span className="dato8">{data.amount} TT</span>
                    <span className="total-profit-stake">
                      <div className="my-stakes-profit"></div>
                      {data.percent} %
                    </span>
                    <span className="date-to-start">
                      <div className="my-stakes-calendar"></div>
                      {data.start} -{data.finish}
                    </span>
                  </div>
                </div>
              );
            })
          : null}
      </React.Fragment>
    );
    return (
      <div className="App">
        <div className="dashboard"></div>
        <div className="logo-dashboard"></div>
        <div className="logos-dashboard">
          <div className="home-logo"></div>
          <div className="lottery-logo"></div>
          <div className="audit-logo"></div>
          <div className="support-logo"></div>
          <div className="presentation-logo"></div>
          <div className="chat-logo"></div>
        </div>
        <span className="home">
          <a
            className="chat-link"
            onClick={() =>
              this.setState({ isHomeVisible: !this.state.isHomeVisible })
            }
          >
            Home
          </a>
        </span>
        <span className="lottery">
          <a
            className="chat-link"
            onClick={() =>
              this.setState({ isLotteryVisible: !this.state.isLotteryVisible })
            }
          >
            Lottery
          </a>
        </span>
        <span className="audit">Audit</span>
        <span className="support">Support</span>
        <span className="presentation">Presentation</span>
        <span className="chat-dashboard">
          <a className="chat-link" href="/chat">
            Chat
          </a>
        </span>
        <div className="connect-wallet-block">
          <img className="connect-wallet-logo" src={coonectWalletLogo}></img>
          <Button primary onClick={this.componentDidMount}>
            <span className="connect-wallet-state">
              {this.state.userWallet}
            </span>
          </Button>
        </div>
        <span className="input-group-btn"></span>

        {this.state.isLotteryVisible ? <Lottery></Lottery> : dashboardVisible}
        {this.state.isHomeVisible ? dashboardVisible : null}
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
