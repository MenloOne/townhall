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
}

export default EthereumLottery;
