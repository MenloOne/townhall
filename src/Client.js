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

import web3 from './web3_override';
import truffleContract from 'truffle-contract';
import tokenContract from './truffle_artifacts/contracts/AppToken.json';
import MessageBoardError from './MessageBoardError';

class Client {
  constructor(graph, forum, lottery, localStorage, remoteStorage) {
    this.graph = graph;
    this.forum = forum;
    this.lottery = lottery;
    this.localStorage = localStorage;
    this.remoteStorage = remoteStorage;
    this.token = truffleContract(tokenContract);

    forum.subscribeMessages(this.onNewMessage.bind(this));
    this.votes = {};
    this.epoch = 0;
    lottery.epoch().then(e => { this.epoch = e});
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

        this.account = account;
        this.token.deployed()
          .then(i => i.balanceOf(account))
          .then(balance => resolve({ account, balance }));
      });
    });
  }

  onNewMessage(messageHash, parentHash) {
    this.lottery.votes(this.forum.topicOffset(messageHash))
      .then(votesCount => {
        this.votes[messageHash] = votesCount
        this.graph.addNode(messageHash, parentHash);
      })
  }

  subscribeMessages(callback) {
    this.graph.subscribeMessages(callback);
  }

  countReplies(nodeID) {
    return this.graph.children(nodeID).length;
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
      body: messageBody,
      issuer: this.account
    };

    const messageHash = await this.localStorage.createMessage(message)
      .catch(() => Promise.reject(new MessageBoardError('An error occurred saving the message to your local IPFS.')));

    await this.forum.post(messageHash, message.parent)
      .catch(() => Promise.reject(new MessageBoardError('An error occurred verifying the message.')));

    return this.remoteStorage.pin(messageHash)
      .catch(() => Promise.reject(new MessageBoardError('An error occurred saving the message to Menlo IPFS.')));
  }

  topicOffset(messageHash) {
    return this.forum.topicOffset(messageHash);
  }

  getVotes(messageHash) {
    return this.votes[messageHash] || 0;
  }

  upvote(messageHash) {
    return this.lottery.upvote(this.topicOffset(messageHash));
  }

  downvote(messageHash) {
    return this.lottery.downvote(this.topicOffset(messageHash));
  }

  getPayoutAccounts() {
    return this.lottery.payoutAccounts();
  }

  claim(payoutIndex) {
    return this.lottery.claim(payoutIndex);
  }

  getRewards() {
    return this.lottery.rewards();
  }
}

export default Client;
