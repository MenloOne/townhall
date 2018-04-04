import React from 'react';
import Message from './Message';
import MessageForm from './MessageForm';

class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [] };
  }

  componentDidMount() {
    this.props.client.getLocalMessages()
      .then(messages => this.setState({ messages }));
  }

  onFormSubmit(messageBody) {
    return this.props.client.createMessage(messageBody)
      .then(messageHash => {
        const message = { hash: messageHash, body: messageBody };
        this.setState({ error: null, messages: [...this.state.messages, message] });
      })
      .catch(error => this.setState({ error: error.message }));
  }

  renderMessages() {
    if (this.state.messages.length === 0) return (<p>There are no messages.</p>);

    return this.state.messages.map((message, index) => {
      return (
          <Message key={`${index}-${message.hash}`}
            hash={message.hash}
            type={"parent"}
            client={this.props.client}
            body={message.body} />);
    });
  }

  render() {
    return (
        <React.Fragment>
          <div>{this.renderMessages()}</div>
          <MessageForm onSubmit={this.onFormSubmit.bind(this)} error={this.state.error} />
        </React.Fragment>
    );
  }
}

export default MessagesContainer;
