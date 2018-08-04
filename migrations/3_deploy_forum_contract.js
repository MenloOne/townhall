var Forum = artifacts.require("./Forum.sol");

module.exports = deployer => {
  return deployer.deploy(Forum);
}
