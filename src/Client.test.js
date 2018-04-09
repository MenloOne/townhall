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

jest.mock('truffle-contract');
import truffleContract from 'truffle-contract';
import * as web3 from './web3_override';
import Client from './Client';
import MessageBoardError from './MessageBoardError';

describe('Client', () => {
  const children = ['hash1', 'hash2'];
  const localMessages = { hash1: 'message 1', hash2: 'message 2' };
  let graph, forum, lottery, localStorage, remoteStorage, contract, client;

  beforeEach(() => {
    graph = { addNode: jest.fn(() => true), children: jest.fn(() => children) };
    forum = { post: jest.fn(() => Promise.resolve(true)) };
    lottery = { };
    localStorage = {
      createMessage: jest.fn(() => Promise.resolve('localHash')),
      findMessage: jest.fn((hash) => Promise.resolve(localMessages[hash]))
    };
    remoteStorage = { pin: jest.fn(() => Promise.resolve('resolvedHash')) };

    contract = {
      setProvider: jest.fn(),
      deployed: jest.fn(() => Promise.resolve({
        balanceOf: jest.fn(() => Promise.resolve('balance'))
      }))
    };
    truffleContract.mockImplementation(() => contract);

    client = new Client(graph, forum, lottery, localStorage, remoteStorage);
  });

  describe('retrieving account details', () => {
    it('rejects if web3 is not initialized', done => {
      web3.default = undefined;

      client.getAccountDetails().catch(done);
    });

    it('rejects if an account does not exist', done => {
      web3.default = {
        currentProvider: 'provider',
        eth: {
          getAccounts: jest.fn((callback) => callback(null, []))
        }
      };

      client.getAccountDetails().catch(done);
    });

    it('resolves the account and its balance', () => {
      web3.default = {
        currentProvider: 'provider',
        eth: {
          getAccounts: jest.fn((callback) => callback(null, ['account']))
        }
      };

      return client.getAccountDetails()
        .then(({ account, balance }) => {
          expect(contract.setProvider).toHaveBeenCalledWith('provider');

          expect(account).toEqual('account');
          expect(balance).toEqual('balance');
        })
    });
  });

  describe('retrieving local messages', () => {
    it('retrieves messages from the root node 0x0 if a nodeID is not given', () => {
      return client.getLocalMessages()
        .then(messages => {
          expect(graph.children).toHaveBeenCalledWith("0x0");
          expect(messages[0]).toEqual(localMessages['hash1']);
          expect(messages[1]).toEqual(localMessages['hash2']);
        });
    });

    it('retrieves messages from the given nodeId', () => {
      return client.getLocalMessages('someNodeID')
        .then(messages => {
          expect(graph.children).toHaveBeenCalledWith('someNodeID');
          expect(messages[0]).toEqual(localMessages['hash1']);
          expect(messages[1]).toEqual(localMessages['hash2']);
        });
    });
  });

  describe('creating a message', () => {
    it('throws a MessageBoardError if localStorage rejects creating the message', () => {
      localStorage = { createMessage: jest.fn(() => Promise.reject()) };

      client = new Client(graph, forum, lottery, localStorage, remoteStorage);

      return client.createMessage('someMessage')
        .catch(error => {
          expect(error).toBeInstanceOf(MessageBoardError);
        });
    });

    it('throws a MessageBoardError if forum rejects posting the message', () => {
      forum = { post: jest.fn(() => Promise.reject()) };

      client = new Client(graph, forum, lottery, localStorage, remoteStorage);

      return client.createMessage('someMessage')
        .catch(error => {
          expect(error).toBeInstanceOf(MessageBoardError);
        });
    });

    it('throws a MessageBoardError if remoteStorage rejects pinning the message', () => {
      remoteStorage = { pin: jest.fn(() => Promise.reject()) };

      client = new Client(graph, forum, lottery, localStorage, remoteStorage);

      return client.createMessage('someMessage')
        .catch(error => {
          expect(error).toBeInstanceOf(MessageBoardError);
        });
    });

    it('stores the message in localStorage, forum, graph, and pins to remoteStorage with parent hash 0x0', () => {
      return client.createMessage('someMessage')
        .then(resolved => {
          expect(localStorage.createMessage).toHaveBeenCalledWith({
            version: 'CONTRACT_VERSION',
            parent: '0x0',
            body: 'someMessage'
          });

          expect(forum.post).toHaveBeenCalledWith('localHash', '0x0');
          expect(graph.addNode).toHaveBeenCalledWith('localHash', '0x0');
          expect(remoteStorage.pin).toHaveBeenCalledWith('localHash');
          expect(resolved).toEqual('resolvedHash');
        });
    });

    it('stores the message in localStorage, forum, graph, and pins to remoteStorage with given parent hash', () => {
      return client.createMessage('someMessage', 'parentHash')
        .then(resolved => {
          expect(localStorage.createMessage).toHaveBeenCalledWith({
            version: 'CONTRACT_VERSION',
            parent: 'parentHash',
            body: 'someMessage'
          });

          expect(forum.post).toHaveBeenCalledWith('localHash', 'parentHash');
          expect(graph.addNode).toHaveBeenCalledWith('localHash', 'parentHash');
          expect(remoteStorage.pin).toHaveBeenCalledWith('localHash');
          expect(resolved).toEqual('resolvedHash');
        });
    });
  });
});
