var ThunderHold = artifacts.require("./ThunderHold.sol");

module.exports = function (deployer, network) {

  if (network == "development" || network == "docker") {

    deployer.deploy(
      ThunderHold,
      "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
      Math.round(new Date().getTime() / 1000)
    );
  } else {
    // Si es Rinkeby, voy a esperar que me retorne la url del contrato, esta se almacena en el ABI

    deployer.deploy(
      ThunderHold,
      "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
      Math.round(new Date().getTime() / 1000)
    )
      // Option 2) Console log the address:
      .then(() => console.log(ThunderHold.address));

  }

};
