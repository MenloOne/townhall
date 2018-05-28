/*
 * 
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

import React from 'react';
import ReactDOM from 'react-dom';
import JavascriptIPFSStorage from 'storage/JavascriptIPFSStorage';
import RemoteIPFSStorage from 'storage/RemoteIPFSStorage';
import EthereumForum from 'contracts/EthereumForum';
import EthereumLottery from 'contracts/EthereumLottery';
import MessageBoardGraph from 'storage/MessageBoardGraph';
import Client from './Client';
import App from 'components/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const remoteStorage = new RemoteIPFSStorage(process.env.REACT_APP_REMOTE_IPFS);
const localStorage = new JavascriptIPFSStorage();
localStorage.connectPeer(remoteStorage);

const forum = new EthereumForum();
const lottery = new EthereumLottery()
const graph = new MessageBoardGraph();

const client = new Client(graph, forum, lottery, localStorage, remoteStorage);
ReactDOM.render(<App client={client} />, document.getElementById('root'));

registerServiceWorker();
