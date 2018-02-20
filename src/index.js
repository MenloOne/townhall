import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MessageBoardView from 'components/MessageBoardView';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<MessageBoardView />, document.getElementById('root'));
registerServiceWorker();
