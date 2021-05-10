import React, { Component } from "react";
import { Input, Button } from "semantic-ui-react";
import AntiWallet from "./../contracts/AntiWallet.json";
import getWeb3 from "./../getWeb3";

import "./../App.css";

export class Home extends Component {
  state = { web3: null, accounts: null, contract: null };

  // This syntax ensures `this` is bound within handleClick.
  // Warning: this is *experimental* syntax.
  onclick = async () => {
    console.log("State into onclick: ", this.state);

    /*
            Invoque alice() function to emit an event
            El contrato se despliega con la Account[0] y las posteriores interacciones con la Account[{X}-[0]]
            Importante, por defecto un metodo de Solidity que genere un evento implica que se esta cambiando
            el estado del contrato, y por esa razon no se pueden generar eventos en simples calls
            Revisar aqui conceptos de cambio de estado y llamadas a funcion
            https://ethereum.stackexchange.com/questions/26841/how-to-get-return-value-in-web3
            Para que voy a usar el resultado de la invocacion al metodo? para cambiar el estado del constrato
            o solo para mostarlo en pantalla?
            Esta funcion devuelve un transaction result y no el resultado de la fucion, para obtener el
            mismo es necesario invocar al getter del estado o analizar el evento
        */
    var trxRresult = this.state.contract.methods
      .alice(3, 2)
      .send({ from: this.state.accounts[1] })
      .on("error", function (error) {
        console.log("Error invoking alice() method on the contract: ", error);
      })
      .then(function (receipt) {
        // Porque vienen los eventos aca en el recibo de la transaccion? o cuales vienen?
        // console.log("trxReceipt: ", receipt);
      });
  };

  /*
    componentDidMount: Entrypoint del fe, se ejecuta una vez justo antes que todo
  */
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      console.log(web3);

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);

      // Get the metworkID
      const networkId = await web3.eth.net.getId();
      console.log("networkId ", networkId);

      // Para poder utilizar una cuenta debo desbloquearla por un tiempo determinado
      web3.eth.personal.unlockAccount(accounts[0], "", 300);

      // Obtengo e imprimo el Balance en Ether de la cuenta principal 'coinBase'
      // Probar con otra cuenta cualquiera que desee el usuario
      web3.eth
        .getBalance(accounts[0])
        .then(function (etherBalance) {
          console.log("Ether:", web3.utils.fromWei(etherBalance, "ether"));
        })
        .catch(function (error) {
          console.log("ERROR", error);
        });

      // Aqui se realiza la carga 'load' del contrato
      // Si el contrato no esta desplegado, esta seccion del codigo va a dar error
      // Quiza sea una buena idea agregar el codigo necesario para chequear si el contrato (1 instancia) esta instanciado
      let deployedNetwork = AntiWallet.networks[networkId];
      const antiWalletContract = new web3.eth.Contract(
        AntiWallet.abi,
        deployedNetwork && deployedNetwork.address
      );
      console.log("Direccion del contrato ", deployedNetwork.address);
      console.log("Datos del contrato ", AntiWallet);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: antiWalletContract }, this.updateState);
      // Seteo como estado un objeto state y le agrego un metodo que se ejecuta..
      this.setState(
        { web3, accounts, contract: antiWalletContract },
        this.getContractStatistics
      );

      // Me suscribo a los eventos de interes
      this.setSuscriptions();

      // Obtengo los eventos anterios que ocurrietron. Logicamente estos no cambian el estado actual
      // del contrato y solo sirven para recabar informacion previa
      // Este metodo se debe llamar una vez que esta actualizado el state de la pagina
      this.getPastEvents();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract or suscribe to events. Check console for details.`
      );
      console.error(error);
    }
  };

  /*
        setSuscriptions: Setea las suscripciones a eventos de contrato
    */
  setSuscriptions = async () => {
    const { contract } = this.state;

    // Otra alternmativa para hacer watching de eventos, ademas de suscribe
    contract.events
      .AliciaEvent()
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
    let events = contract.getPastEvents(
      "AliciaEvent",
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

          console.log(obj);
          console.log(array);
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
    const { accounts, contract } = this.state;

    /*
          Aqui toda la interaccion con el contrato. Obtengo las estadisticas actuales del contrato
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
    // Setear un valor en el contrato, que no reemplaza un nombre previo, logra apendear el nuevo
    // valor a la lista de valores del estado sin cambiar datos anteriores
    this.setState({
      contractBalance: contractBalance,
      totalStaked: totalStaked,
      totalRefBonus: totalRefBonus,
    });
  };

  /*
        render: Dibuja el fe
    */
  render() {
    return (
      <div className="App">
        <h2>Smart Contract Base </h2>

        <div>Contract Balance: {this.state.contractBalance}</div>
        <div>
          <Button
            onClick={async () => {
              await this.onclick();
            }}
          >
            Click me to invoque a contract method
          </Button>
        </div>
      </div>
    );
  }
}
