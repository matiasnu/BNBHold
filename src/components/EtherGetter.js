import React, { useState, useEffect } from "react";
import CoinGecko from "coingecko-api"


function EtherGetter(props) {

  // Estadisticas Generales del contrato
  const [dollarsEQ, setDollarsEQ] = useState(0);


  useEffect(() => {
    convertCryptocurrencyPriceToDollars();

  }, []);

  const convertCryptocurrencyPriceToDollars = async () => {
    const CoinGeckoClient = new CoinGecko();
    const cryptocurrency = 'ethereum';
    let data = await CoinGeckoClient.simple.price({
      ids: cryptocurrency,
      vs_currencies: 'usd',
    });
    console.log("PRECIO EN DOLARES " + data.data.ethereum.usd);
    setDollarsEQ(data.data.ethereum.usd);
  }

  return (

    <div>
      <p>{dollarsEQ} US Dollars</p>
    </div>
  );


}

export default EtherGetter;



// Para invocar un oracle y obtener un valor externo a traves de un contrato
// const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
// const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331";
// const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
// priceFeed.methods.latestRoundData().call()
//     .then((roundData) => {
//         // Do something with roundData
//         console.log("Latest Round Data", roundData)
//     });

