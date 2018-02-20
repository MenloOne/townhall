import React, { Component } from 'react';
import logo from 'logo.svg';
import './MessageBoardView.css';

class MessageBoardView extends Component {
  render() {
    return (
      <div className="MessageBoardView">
        <header className="MessageBoardView-header">
          <img src={logo} className="MessageBoardView-logo" alt="logo" />
          <h1 className="MessageBoardView-title">Welcome to React</h1>
        </header>
        <p className="MessageBoardView-intro">
          To get started, edit <code>src/MessageBoardView.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default MessageBoardView;
