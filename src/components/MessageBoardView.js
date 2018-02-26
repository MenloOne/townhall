import React, { Component } from 'react';
import './MessageBoardView.css';

class MessageBoardView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      newMessage: '',
    }
  }

  renderMessages() {
    if(this.state.messages.length === 0) { return (<p>There are no messages.</p>); }

    let messageItems = this.state.messages.map((message, hash) => {
      return (<li key={hash}>{message.body}</li>);
    });

    return (
      <ul>
        {messageItems}
      </ul>
    );
  }

  setOnCreateMessage = (handler) => {
    this.setState({onCreateMessage: handler})
  }

  setMessages = (messages) => {
    this.setState({messages: messages})
  }

  setError = (on, message) => {

  }

  onMessageFormSubmit = (event) => {
    event.preventDefault();
    this.state.onCreateMessage(this.state.newMessage);
    this.setState({newMessage: ''});
  }

  onMessageFormChange = (event) => {
    this.setState({newMessage: event.target.value});
  }

  renderCreateMessage() {
    if(!this.state.onCreateMessage) { return; }

    return (
      <form onSubmit={this.onMessageFormSubmit}>
        <label>
          Message:
          <input type="text" value={this.state.newMessage} onChange={this.onMessageFormChange} />
          <input type="submit" value="Send" />
        </label>
      </form>
    );
  }

  render() {
    return (
      <div className="MessageBoardView">
        {this.renderMessages()}
        {this.renderCreateMessage()}
      </div>
    );
  }
}

export default MessageBoardView;
