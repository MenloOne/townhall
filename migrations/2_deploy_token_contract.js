var AppToken = artifacts.require("./AppToken.sol");

module.exports = (deployer, network) => {
  let trustee1, trustee2, trustee3;

  if (network == "develop") {
    // mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
    trustee1 = '0x627306090abab3a6e1400e9345bc60c78a8bef57';
    trustee2 = '0xf17f52151ebef6c7334fad080c5704d77216b732';
    trustee3 = '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef';
  } else {
    require('dotenv').config()
    trustee1 = process.env.MENLO_TENET_1
    trustee2 = process.env.MENLO_TENET_2
    trustee3 = process.env.MENLO_TENET_3
  }

  return deployer.deploy(AppToken, trustee1, trustee2, trustee3);
}
