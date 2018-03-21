var Token = artifacts.require("./Token.sol");
var Forum = artifacts.require("./Forum.sol");
var Lottery = artifacts.require("./Lottery.sol");

module.exports = deployer => {
  var forum;
  var token_address = Token.address;
  var forum_address = Forum.address;
  Forum.deployed().then(instance => forum = instance);
  deployer.deploy(Lottery, token_address, forum_address)
    .then(() => Lottery.deployed())
    .then(lottery => forum.setBeneficiary(lottery.address))
}
