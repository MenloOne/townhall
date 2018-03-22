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

  messageSendSucceeded = () => {
    this.setState({error: null, newMessage: ''});
  }

  messageSendFailed = (errorMessage) => {
    this.setState({error: errorMessage});
  }

  onMessageFormSubmit = (event) => {
    event.preventDefault();
    this.state.onCreateMessage(this.state.newMessage);
  }

  onMessageFormChange = (event) => {
    this.setState({newMessage: event.target.value});
  }

  renderCreateMessage() {
    if(!this.state.onCreateMessage) { return; }
    let errorMessage;
    if(this.state.error) {
      errorMessage = (<div>{this.state.error}</div>);
    }

    return (
      <form onSubmit={this.onMessageFormSubmit}>
        <label>
          Message:
          <input type="text" value={this.state.newMessage} onChange={this.onMessageFormChange} />
          <input type="submit" value="Send" />
        </label>
        {errorMessage}
      </form>
    );
  }

  updateBalance(accountDetails) {
    this.setState({accountDetails: accountDetails});
  }

  renderAccountDetails() {
    if(!this.state.accountDetails) { return; }

    return (
      <div>{this.state.accountDetails.account} ({this.state.accountDetails.balance} MET)</div>
    )
  }

  renderAuthenticatedActions = () => {
    return (
      <React.Fragment>
        {this.renderCreateMessage()}
        {this.renderAccountDetails()}
      </React.Fragment>
    )
  }

  renderUnauthenticatedActions() {
    return (
      <div>
        Not connected to Ethereum. Use <a href="https://metamask.io/">Metamask</a>{' '}
        or <a href="https://github.com/ethereum/mist/releases">Mist</a> to connect
        to Ethereum.
      </div>
    )
  }

  render() {
    let actions = this.state.accountDetails ? this.renderAuthenticatedActions : this.renderUnauthenticatedActions

    return (
      <div className="MessageBoardView">
        {this.renderMessages()}
        {actions()}
      </div>
    );
  }
}

export default MessageBoardView;
