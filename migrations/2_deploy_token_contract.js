var AppToken = artifacts.require("./AppToken.sol");
var Web3 = require('web3')

module.exports = (deployer, network) => {
  let trustee1, trustee2, trustee3;

  if ((network == "development") || (network == "ganache")) {
    // mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
    trustee1 = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
    trustee2 = '0xf17f52151ebef6c7334fad080c5704d77216b732';
    trustee3 = '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef';
  } else {
    /*
    trustee1 = ENV['MENLO_TRUSTEE_1']
    trustee2 = ENV['MENLO_TRUSTEE_2']
    trustee3 = ENV['MENLO_TRUSTEE_3']
    */
    // Parity Local
    trustee1 = '0x008FfF80135Ac36aE8206E574e312FE8E64C34b2'
    trustee2 = '0x0012c389c4E2557a29BC3988C3fA3E78d267376B'
    trustee3 = '0x00F2f2d765E4f6d59FD43b63Fbe4035B1E6BBa02'
  }

  deployer.deploy(AppToken, trustee1, trustee2, trustee3);
}
