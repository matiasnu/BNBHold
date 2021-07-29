import React, { useState, Component} from "react";

// Estadisticas Generales del contrato
const [walletsAccount, setwalletsAcount] = useState(0); // Cantidad de Wallets diferentes que invirtieron en el contrato
export class Stats extends Component {
  render() {
    return (
      <div>
        <p>You clicked {walletsAccount} times</p>
        <button onClick={() => setwalletsAcount(walletsAccount + 1)}>
          Click me
        </button>
      </div>
    )
  }
}
