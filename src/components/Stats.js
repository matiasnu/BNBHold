import React, { useState } from "react";
import { withRouter } from "react-router";

function Stats() {
  // Estadisticas Generales del contrato
  const [walletsAccount, setwalletsAcount] = useState(0); // Cantidad de Wallets diferentes que invirtieron en el contrato

  return (
    <div>
      <p>You clicked {walletsAccount} times</p>
      <button onClick={() => setwalletsAcount(walletsAccount + 1)}>
        Click me
      </button>
    </div>
  );
}
export default withRouter(Stats);
