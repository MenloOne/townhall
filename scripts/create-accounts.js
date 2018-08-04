let Web3 = require('web3')

console.log('Creating accounts')

let provider = new Web3.providers.HttpProvider("http://localhost:8545")
let web3 = new Web3(provider)

console.log("Creating tenents")

let trustee1 = web3.eth.accounts.create();
let trustee2 = web3.eth.accounts.create();
let trustee3 = web3.eth.accounts.create();
let poster = web3.eth.accounts.create();

require('dotenv').config()
var parity_dev = process.env.MENLO_PERSONAL

var tx = web3.eth.sendTransaction({from: parity_dev,
                                     to: poster.address,
                                     gas: 210000,
                                     value: (10037037)})
.then(function(receipt){
});

console.log("Make sure you approve the following transactions in Parity UI\n")

console.log("Add the following to your .env:")
console.log("MENLO_TENET_1=" + trustee1.address)
console.log("MENLO_TENET_2=" + trustee2.address)
console.log("MENLO_TENET_3=" + trustee3.address)
console.log("MENLO_POSTER=" + poster.address)
