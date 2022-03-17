const ETHPool = artifacts.require("ETHPool");

module.exports = function (deployer) {
  deployer.deploy(ETHPool);
};
