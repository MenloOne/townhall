var AppToken = artifacts.require("./AppToken.sol");
var Forum = artifacts.require("./Forum.sol");

module.exports = (deployer, network) => {
  var personal;

  if ((network == "development") || (network == "ganache")) {
    // static truffle develop accounts
    // candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
    personal = '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2';
  } else {
    //personal = ENV['MENLO_ACCOUNT'];
    personal = '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2';
  }

  var forum_address;
  Forum.deployed().then(instance => forum_address = instance.address);

  // Fund personal account with MET
  AppToken.deployed().then(token => {
    let amount = 10000000000000000000000000000;
    token.transfer(personal, amount);
    token.approve(forum_address, amount,
                {from: '0x0d1d4e623d10f9fba5db95830f7d3839406c6af2'});
  })
}
