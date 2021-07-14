var ThunderHold = artifacts.require("./ThunderHold.sol");

module.exports = function (deployer) {
  deployer.deploy(
    ThunderHold,
    "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",     
    Math.round(new Date().getTime() / 1000)
  );
};