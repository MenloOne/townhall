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

const remoteStorage = new RemoteIPFSStorage();
const localStorage = new JavascriptIPFSStorage();
localStorage.connectPeer(remoteStorage);

const forum = new EthereumForum();
const lottery = new EthereumLottery()
const graph = new MessageBoardGraph();

forum.subscribeMessages(graph);

const client = new Client(graph, forum, lottery, localStorage, remoteStorage);
ReactDOM.render(<App client={client} />, document.getElementById('root'));

registerServiceWorker();
