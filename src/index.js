import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MessageBoardApp from 'MessageBoardApp'
import MemoryStorage from 'storage/MemoryStorage';
import IPFSStorage from 'storage/IPFSStorage';
import MemoryContract from 'contracts/MemoryContract';
import MessageBoardView from 'components/MessageBoardView';
import registerServiceWorker from './registerServiceWorker';

let localStorage = new IPFSStorage();
let contract = new MemoryContract();
let menloStorage = new MemoryStorage();
let view = ReactDOM.render(<MessageBoardView />, document.getElementById('root'));
let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

app.viewMessages();
app.createMessage("Message 1");
app.createMessage("Message 2");
app.createMessage("Message 3");

registerServiceWorker();
