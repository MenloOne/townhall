let Web3 = require('web3')

console.log('Creating accounts')

let provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545")
let web3 = new Web3(provider)

console.log("Creating tenents")

let trustee1 = web3.eth.accounts.create();
let trustee2 = web3.eth.accounts.create();
let trustee3 = web3.eth.accounts.create();
let poster = web3.eth.accounts.create();

console.log(poster['address'])
