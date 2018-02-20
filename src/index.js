import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MessageBoardApp from 'MessageBoardApp'
import MessageBoardView from 'components/MessageBoardView';
import registerServiceWorker from './registerServiceWorker';

let view = ReactDOM.render(<MessageBoardView />, document.getElementById('root'));
let app = new MessageBoardApp({view: view});
app.run();
registerServiceWorker();
