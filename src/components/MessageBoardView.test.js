import React from 'react';
import ReactDOM from 'react-dom';
import MessageBoardView from './MessageBoardView';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MessageBoardView />, div);
  ReactDOM.unmountComponentAtNode(div);
});
