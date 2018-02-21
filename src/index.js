import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MessageBoardApp from 'MessageBoardApp'
import MessageBoardStorage from 'MessageBoardStorage';
import MessageBoardContract from 'contracts/MessageBoardContract';
import MessageBoardView from 'components/MessageBoardView';
import registerServiceWorker from './registerServiceWorker';

let localStorage = new MessageBoardStorage();
let contract = new MessageBoardContract();
let menloStorage = new MessageBoardStorage();
let view = ReactDOM.render(<MessageBoardView />, document.getElementById('root'));
let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

app.createMessage("Message 1");
app.createMessage("Message 2");
app.createMessage("Message 3");
app.viewMessages();

registerServiceWorker();
