const path = require("path");

// Solo para Rinkeby/Produccion
const HDWalletProvider = require("@truffle/hdwallet-provider");

// TODO por favor trabajar con variables de entorno para el pasaje de parametros de seguridad
// como los usados en HDWalletProvider

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    // Development
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      websockets: true,
    },
    // CI
    docker: {
      host: "ganache",
      port: 8545,
      network_id: "*",
      websockets: true,
    },
    // CD on Rinkeby
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          "under smart shiver card hurt tourist true crater flee quiz group sad",
          "wss://rinkeby.infura.io/ws/v3/776e2e5b48554e709e4727937add828c",
          0
        ),
      network_id: "4",
      gas: 6000000,
      //      gasPrice: 29970705,
      confirmations: 1,
    },
    kovan: {
      provider: () =>
        new HDWalletProvider(
          "under smart shiver card hurt tourist true crater flee quiz group sad",
          "wss://kovan.infura.io/ws/v3/776e2e5b48554e709e4727937add828c",
          0
        ),
      network_id: "42",
      gas: 6000000,
      confirmations: 1,
    },    
  },
  plugins: ["solidity-coverage"],
  // MAD Esto es para forzar a truffle a que compile con la vesion definida en el pragma
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      //settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      //}
    },
  },
};



