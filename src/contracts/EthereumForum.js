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
