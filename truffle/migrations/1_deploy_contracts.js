const GoldVerification = artifacts.require("GoldVerification");

module.exports = function (deployer) {
  deployer.deploy(GoldVerification);
};