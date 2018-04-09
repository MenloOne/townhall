import web3 from 'web3_override';
import TruffleContract from 'truffle-contract';
import LotteryContract from 'truffle_artifacts/contracts/Lottery.json';
import HashUtils from 'HashUtils';

let Lottery = TruffleContract(LotteryContract);
Lottery.setProvider(web3.currentProvider);

class EthereumLottery {
  votes = (hash) => {
    hash = HashUtils.cidToSolidityHash(hash);

    return Lottery.deployed()
      .then(i => i.votes(hash))
  }

  upvote = async (hash) => {
    hash = HashUtils.cidToSolidityHash(hash);

    return web3.eth.getAccounts().then(async (accounts) => {
      let account = accounts[0];

      return Lottery.deployed()
        .then(i => i.upvote(hash, {from: account}))
    })
  }

  downvote = async (hash) => {
    hash = HashUtils.cidToSolidityHash(hash);

    return web3.eth.getAccounts().then(async (accounts) => {
      let account = accounts[0];

      return Lottery.deployed()
        .then(i => i.downvote(hash, {from: account}))
    })
  }
}

export default EthereumLottery;
