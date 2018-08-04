var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");
var Lottery = artifacts.require("./Lottery.sol");

module.exports = (deployer, network) => {
  var trustee1, trustee2, trustee3, personal;

  if (network == "develop") {
    // static truffle develop accounts
    // candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
    trustee1 = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
    trustee2 = '0xf17f52151ebef6c7334fad080c5704d77216b732';
  } else {
    require('dotenv').config()
    trustee1 = process.env.MENLO_TENET_1
    trustee2 = process.env.MENLO_TENET_2
  }

  let forum;
  let token_address = AppToken.address;
  var forum_address = Forum.address;

  return deployer.deploy(Lottery, token_address, forum_address)
    .then(() => Forum.deployed())
    .then(instance => forum = instance)
    .then(() => Lottery.deployed())
    .then(lottery => {
      forum.setBeneficiary(lottery.address);
      AppToken.deployed()
      .then(token => {
        token.install(lottery.address, {from: trustee1} );
        token.install(lottery.address, {from: trustee2} );
      })
    })
}
