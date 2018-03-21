var Token = artifacts.require("Token");
var Forum = artifacts.require("Forum");
var Lottery = artifacts.require("Lottery");

module.exports = function(deployer) {
  var forum, token;
  deployer.then(function() {
    return Token.new(1000000);
  }).then(function(instance) {
    token = instance
    return Forum.new();
  }).then(function(instance) {
    forum = instance;
    return Lottery.new(token.address, forum.address);
  }).then(function(lottery) {
    return forum.setBeneficiary(lottery.address);
  });
};
