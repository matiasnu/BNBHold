// Notas
// Para generar un servidor WebSockets se debe usar ganache como provider?
// Revisar para WS Provider
// https://github.com/ChainSafe/web3.js/tree/1.x/packages/web3-providers-ws#usage

const ganache = require('ganache-core');
const Web3 = require('web3');
const express = require('express');
const fs = require('fs');

var app = express();
app.get('/', function (req, res) {
    res.send('Hello World!');
});

// app.listen(3000, function () {
//     console.log('Example app listening on port 3000!');
// });

console.log("Iniciando");

const provider = new Web3.providers.WebsocketProvider('ws://localhost:8545');
//const web3 = new Web3(ganache.provider());
const web3 = new Web3(provider);

console.log(`Web3.js version: ${web3.version}`);
console.log(`OS Platform: ${process.platform}`);
console.log(`Current Provider: `, web3.currentProvider.url);

var account = web3.eth.getAccounts()
    .then((accounts) => {
        console.log(`Accounts in Private Network: ${accounts.length}`);
        console.log(`Main Account: ${accounts[0]}`);
    });

var jsonFile = "../client/src/contracts/AntiWallet.json";    
var parsed= JSON.parse(fs.readFileSync(jsonFile));
const abi = parsed.abi;
const address = '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7';


// Load del contrato desplegado en una direccion especifica
const antiWalletContract = new web3.eth.Contract(
    abi,
    address
);


// Buena data acerca de Topics
// https://ethereum.stackexchange.com/questions/12950/what-are-event-topics/12951
var subscription = web3.eth.subscribe('logs', 
    {
        address: address, //Smart contract address
        topics: [web3.utils.sha3('AliciaEvent(uint256,uint256)')]   //topics for events
    }, function(error, result){
        if (error) console.log(error);
        else {
            console.log(result);
        }
    }).on("data", function(trxData){
        console.log("Event received", trxData);
        //Code from here would be run immediately when event appeared
    }).on("changed", function(trxData){
        console.log("Event received", trxData);
    }
);


try{

    /*
    Invoque alice() function to emit an event
    */
    antiWalletContract.methods.alice(3,2).send({from: "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0"})
        .on('error', function(error){ 
            console.log("error:", error) 
        })
        .then(function(receipt){
            // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
            console.log("OK:", receipt);
        });

} catch (error) {
    // Catch any errors for any of the above operations.
    console.error("Error invocando metodos de contrato:", error);
}

