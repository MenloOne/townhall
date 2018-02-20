import React, { Component } from 'react';
import './MessageBoardView.css';

class MessageBoardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    }
  }

  renderMessages() {
    if(this.state.messages.length > 0) {
      let messageItems = this.state.messages.map((message) => {
        return (<li key={message.id}>{message.body}</li>);
      });

      return (
        <ul>
          {messageItems}
        </ul>
      );
    } else {
      return (<p>There are no messages.</p>);
    }
  }

  render() {
    return (
      <div className="MessageBoardView">
        {this.renderMessages()}
      </div>
    );
  }
}

export default MessageBoardView;
