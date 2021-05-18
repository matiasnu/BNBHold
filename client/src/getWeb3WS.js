import Web3 from "web3";

const getWeb3WS = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      // Si esta en un browser con el elemento ethereum definido (en este caso instanciado por Metamask)
      // Voy a instanciar 2 web3 providers, uno para suscribirme a eventos y otro para operar con Metamask
      // if (window.ethereum) {
      //   const web3 = new Web3(window.ethereum);
      //   try {
      //     // Request account access if needed
      //     await window.ethereum.enable();
      //     // Acccounts now exposed
      //     resolve(web3);
      //   } catch (error) {
      //     reject(error);
      //   }
      // }
      // // Legacy dapp browsers...
      // else if (window.web3) {
      //   // Use Mist/MetaMask's provider.
      //   const web3 = window.web3;
      //   console.log("Injected web3 detected.");
      //   resolve(web3);
      // }
      // // Fallback to localhost; use dev console port by default...
      // else {
      //   const provider = new Web3.providers.WebsocketProvider(
      //     "ws://127.0.0.1:8545"
      //   );
      //   const web3 = new Web3(provider);
      //   console.log("No web3 instance injected, using Local web3.");
      //   resolve(web3);
      // }
      let web3WSProvider = null;
      try {
        web3WSProvider = new Web3.providers.WebsocketProvider("ws://127.0.0.1:8545");
      } catch(error) {
        reject(error);
      }
      const web3WS = new Web3(web3WSProvider);
      resolve(web3WS);
    });
  });

export default getWeb3WS;
