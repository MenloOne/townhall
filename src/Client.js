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
import truffleContract from 'truffle-contract';
import tokenContract from 'truffle_artifacts/contracts/AppToken.json';
import MessageBoardError from 'MessageBoardError';

class Client {
  constructor(graph, forum, lottery, localStorage, remoteStorage) {
    this.graph = graph;
    this.forum = forum;
    this.lottery = lottery;
    this.localStorage = localStorage;
    this.remoteStorage = remoteStorage;
    this.token = truffleContract(tokenContract);
  }

  getAccountDetails() {
    if (!web3) return Promise.reject();

    this.token.setProvider(web3.currentProvider);

    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, result) => {
        const account = result[0];
        if (!account) {
          return reject();
        }

        this.token.deployed()
          .then(i => i.balanceOf(account))
          .then(balance => resolve({ account, balance }));
      });
    });
  }

  subscribeMessages(callback) {
    this.graph.subscribeMessages(callback);
  }

  getLocalMessages(nodeID) {
    const messageIDs = this.graph.children(nodeID || "0x0");

    return Promise.all(messageIDs.map(id => this.localStorage.findMessage(id)))
      .then(messages => messages.filter(m => m));
  }

  async createMessage(messageBody, parentHash) {
    const message = {
      version: "CONTRACT_VERSION",
      parent: parentHash || "0x0",
      body: messageBody
    };

    const messageHash = await this.localStorage.createMessage(message)
      .catch(() => Promise.reject(new MessageBoardError('An error occurred saving the message to your local IPFS.')));

    await this.forum.post(messageHash, message.parent)
      .catch(() => Promise.reject(new MessageBoardError('An error occurred verifying the message.')));

    this.graph.addNode(messageHash, message.parent);

    return this.remoteStorage.pin(messageHash)
      .catch(() => Promise.reject(new MessageBoardError('An error occurred saving the message to Menlo IPFS.')));
  }

  getVotes(messageHash) {
    return this.lottery.votes(messageHash);
  }

  upvote(messageHash) {
    return this.lottery.upvote(messageHash);
  }

  downvote(messageHash) {
    return this.lottery.downvote(messageHash);
  }
}

export default Client;
