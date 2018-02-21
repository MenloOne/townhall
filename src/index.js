import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MessageBoardApp from 'MessageBoardApp'
import MessageBoardStorage from 'MessageBoardStorage';
import MessageBoardView from 'components/MessageBoardView';
import registerServiceWorker from './registerServiceWorker';

let menloStorage = new MessageBoardStorage();
let view = ReactDOM.render(<MessageBoardView />, document.getElementById('root'));
let app = new MessageBoardApp({view: view, menloStorage: menloStorage});

app.createMessage("Message 1");
app.createMessage("Message 2");
app.createMessage("Message 3");
app.viewMessages();

registerServiceWorker();
