import web3 from 'web3_override';
import TruffleContract from 'truffle-contract';
import ForumContract from 'truffle_artifacts/contracts/Forum.json';
import HashUtils from 'HashUtils';

let Forum = TruffleContract(ForumContract);
Forum.setProvider(web3.currentProvider);

class EthereumForum {
  post = async (hash, parentHash) => {
    hash = HashUtils.cidToSolidityHash(hash);
    if(parentHash !== '0x0') { parentHash = HashUtils.cidToSolidityHash(parentHash); }

    return web3.eth.getAccounts().then(async (accounts) => {
      let account = accounts[0];

      return Forum.deployed()
        .then(i => { return i.post(parentHash, hash, {from: account}) })
    })
  }
}

export default EthereumForum;
