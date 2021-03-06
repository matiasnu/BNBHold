import React, { useState, useEffect } from "react";
import { Button } from 'semantic-ui-react'
import CoinGecko from "coingecko-api"
import "../views/etherGetter.css";
import logoThunder from "../views/images/thunder-token-icon.png";
import configData from "../config/config.json";

function EtherGetter(props) {

  // Estadisticas Generales del contrato
  const [dollarsEQ, setDollarsEQ] = useState(0);
  const [change24Hr, setchange24Hr] = useState(1);


  useEffect(() => {
    convertCryptocurrencyPriceToDollars();

  }, []);

  const convertCryptocurrencyPriceToDollars = async () => {
    const CoinGeckoClient = new CoinGecko();
    const cryptocurrency = configData.cryptocurrency;
    let data = await CoinGeckoClient.simple.price({
      ids: cryptocurrency,
      vs_currencies: 'usd',
      include_24hr_change: true
    });
    setDollarsEQ(data.data.ethereum.usd);
    setchange24Hr(data.data.ethereum.usd_24h_change)
  }

  var getterChangeSuccess = (
    <React.Fragment>
      <div className="getter-change-success">{change24Hr.toPrecision(3)} %</div>
    </React.Fragment>
  );
  var getterChangeFail = (
    <React.Fragment>
      <div className="getter-change-fail">{change24Hr.toPrecision(3).slice(1)} %</div>
    </React.Fragment>
  );

  var my_stake_change = getterChangeFail;
  if (change24Hr >= 0) {
    my_stake_change = getterChangeSuccess;
  }

  var redirect_crypto_stats = "https://coinmarketcap.com/currencies/" + configData.cryptocurrency;

  return (
    <div>
      <div className="getter-price">
        <p className="getter-price-usd">{dollarsEQ} USD</p>
        <img src={logoThunder} style={{width:'17%', height:'17%'}} />
      </div>
      <div className="getter-change">
        <h3 className="getter-change-text">24h variation: </h3>
        <div className="getter-change-num">
          {my_stake_change}
        </div>
      </div>
      <div className="getter-stats">
        <Button color='yellow'>
          <a className="getter-stats-button-text" target="_blank" href={redirect_crypto_stats}>View stats</a>
        </Button>
      </div>
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

