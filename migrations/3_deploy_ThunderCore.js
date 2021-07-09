var ThunderHold = artifacts.require("./ThunderHold.sol");

module.exports = function(deployer) {
  deployer.deploy(
    ThunderHold,
    "0x51c701bc0266ef77288AfF46b465F8c6f8463b12",
    Math.round((new Date()).getTime() / 1000));
};
