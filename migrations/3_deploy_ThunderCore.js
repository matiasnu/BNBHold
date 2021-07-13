var ThunderHold = artifacts.require("./ThunderHold.sol");

module.exports = function (deployer) {
  deployer.deploy(
    ThunderHold,
    "0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b",
    Math.round(new Date().getTime() / 1000)
//    , { gas: 10000000 }
  );
};
