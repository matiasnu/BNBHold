
import Web3 from "web3";
import Web3Modal from "web3modal";
import Portis from "@portis/web3";

// Add new providers, https://www.npmjs.com/package/web3modal-provider-export
// Or see https://github.com/Web3Modal/web3modal/tree/master/docs/providers

const WalletConnectProvider = window.WalletConnectProvider.default;
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      // Mikko's test key - don't copy as your mileage may vary
      infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
    }
  }

  /*portis: {
    package: Portis, // required
    options: {
      id: "8e23465f-c9a7-410a-92df-18b2e3d1c38f",
      network: "maticMumbai"
    }
  }*/
};

let provider = null;
let web3 = null;
//let accounts = null;

const getWeb3Modal = async() => {
    if (!provider) {
      const web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        disableInjectedProvider: false,
        providerOptions // required
      });
      provider = await web3Modal.connect();
      web3 = new Web3(provider);
    }

    /*provider._portis.showPortis();

    if (!accounts) { //Not necesary
      accounts = await web3.eth.getAccounts();
      const p = document.createElement("p");
      p.innerText = (`Wallet address: ${accounts[0].toLowerCase()}`);
      document.getElementById("userWalletAddress").appendChild(p);
    }*/

}

export default getWeb3Modal;