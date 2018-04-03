import React from 'react';
import ReactDOM from 'react-dom';
import JavascriptIPFSStorage from 'storage/JavascriptIPFSStorage';
import RemoteIPFSStorage from 'storage/RemoteIPFSStorage';
import EthereumForum from 'contracts/EthereumForum';
import MessageBoardGraph from 'storage/MessageBoardGraph';
import Client from './client';
import App from 'components/App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const remoteStorage = new RemoteIPFSStorage();
const localStorage = new JavascriptIPFSStorage();
localStorage.connectPeer(remoteStorage);

const forum = new EthereumForum();
const graph = new MessageBoardGraph();
graph.addNode('0x0');

const client = new Client(graph, forum, localStorage, remoteStorage);
ReactDOM.render(<App client={client} />, document.getElementById('root'));

registerServiceWorker();
