var Token = artifacts.require("./Token.sol");

module.exports = deployer => {
  deployer.deploy(Token, 10000000);
}
