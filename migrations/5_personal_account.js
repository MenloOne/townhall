var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");

module.exports = (deployer, network) => {
  var personal;

  if (network == "develop") {
    // static truffle develop accounts
    // candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
    personal = '0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e';
  } else {
    require('dotenv').config()
    personal = process.env.MENLO_PERSONAL
  }

  // Fund personal account with MET
  let amount = 10000000000000000000000;
  AppToken.deployed().then(token => {
    token.transfer(personal, amount);
    token.approve(Forum.address, amount, {from: personal});
  })
}
