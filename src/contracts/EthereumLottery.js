/*
 * Copyright 2018 Vulcanize, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
