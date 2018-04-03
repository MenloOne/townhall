import React from 'react';
import Message from './Message';

class MessagesContainer extends React.Component {
  renderMessages() {
    return this.props.messages.map((message, hash) => {
      return (<Message key={hash} body={message} />);
    });
  }

  render() {
    if (this.props.messages.length === 0) return (<p>There are no messages.</p>);

    return (<ul>{this.renderMessages()}</ul>);
  }
}

export default MessagesContainer;
