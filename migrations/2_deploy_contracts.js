var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var HelloWorld = artifacts.require("./HelloWorld.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(HelloWorld);
};
