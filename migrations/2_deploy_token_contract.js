var AppToken = artifacts.require("./AppToken.sol");

// hard-coded developer values based on mnemonic:
// candy maple cake sugar pudding cream honey rich smooth crumble sweet treat

let trustee1 = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
let trustee2 = '0xf17f52151ebef6c7334fad080c5704d77216b732';
let trustee3 = '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef';

module.exports = deployer => {
  deployer.deploy(AppToken, trustee1, trustee2, trustee3);
}
