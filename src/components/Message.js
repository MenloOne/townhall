import React from 'react';
import MessageForm from './MessageForm';
import './Message.css';

class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showReplyForm: false, children: [] };
  }

  showReplyForm() {
    this.setState({ showReplyForm: true });
  }

  reply(messageBody) {
    return this.props.client.createMessage(messageBody, this.props.hash)
      .then(messageHash => {
        const child = (
            <Message key={`${this.state.children.length}-${messageHash}`}
              hash={messageHash}
              type={"child"}
              body={messageBody} />);

        this.setState({ children: [...this.state.children, child], showReplyForm: false });
      });
  }

  render() {
    return (
        <div className={`message ${this.props.type}`}>
          <div className="text">{this.props.body}</div>
          <div className="actions">
            {this.props.type === "parent" && <a className="reply" onClick={this.showReplyForm.bind(this)}>reply</a>}
          </div>
          {this.state.showReplyForm &&
            <MessageForm id={this.props.hash} type={"Response"} onSubmit={(message) => this.reply(message)} />}
          {this.state.children}
        </div>
    );
  }
}

export default Message;
