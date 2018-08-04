var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");

module.exports = (deployer, network) => {

  if (network == "develop") {
    // static truffle develop accounts
    // candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
    poster = '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2';
  } else {
    require('dotenv').config()
    poster = process.env.MENLO_POSTER
  }

  // Fund personal account with MET
  let amount = 10000000000000000000000;
  AppToken.deployed().then(token => {
    token.transfer(poster, amount);
    token.approve(Forum.address, amount, {from: poster});
  })
}
