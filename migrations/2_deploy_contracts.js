var AntiWallet = artifacts.require("./AntiWallet.sol");

module.exports = function(deployer) {
  deployer.deploy(AntiWallet, 1619324276);
};

