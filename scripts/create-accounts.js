let Web3 = require('web3')

console.log('Creating accounts')

let provider = new Web3.providers.HttpProvider("http://localhost:8545")
let web3 = new Web3(provider)

console.log("Creating tenents")

let trustee1 = web3.eth.accounts.create();
let trustee2 = web3.eth.accounts.create();
let trustee3 = web3.eth.accounts.create();
let poster = web3.eth.accounts.create();

let geth_dev = ''
let parity_dev = '0x00a329c0648769a73afac7f9381e08fb43dbea72'
/*

var tx = web3.eth.sendTransaction({from: parity_dev,
                                     to: poster.address,
                                     gas: 210000,
                                     value: (10037037)})
.then(function(receipt){
  console.log(receipt)
});
console.log(poster)
*/
web3.eth.personal.newAccount('')
.then(account => {
  var tx = web3.eth.sendTransaction({from: parity_dev,
                                      to: account,
                                      gas: 210000,
                                      value: (10037037)})
  .then(function(receipt){
    console.log(receipt)
  })
})
