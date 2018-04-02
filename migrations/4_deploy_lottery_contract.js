var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");
var Lottery = artifacts.require("./Lottery.sol");

module.exports = deployer => {
  var forum;
  var token_address = AppToken.address;
  var forum_address = Forum.address;
  Forum.deployed().then(instance => forum = instance);
  deployer.deploy(Lottery, token_address, forum_address)
    .then(() => Lottery.deployed())
    .then(lottery => {
      forum.setBeneficiary(lottery.address);
      AppToken.deployed()
      .then(t => {
        t.install(lottery.address, {from: '0xf17f52151ebef6c7334fad080c5704d77216b732'})
        t.install(lottery.address, {from: '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef'})
      })
    })
}
