/*
 * Copyright 2018 Vulcanize, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import Message from './Message';
import MessageForm from './MessageForm';

class MessagesContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [], topFive: false };
  }

  componentDidMount() {
    this.props.client.subscribeMessages(this.refreshMessages.bind(this));
    this.refreshMessages();
  }

  refreshMessages() {
    this.props.client.getLocalMessages()
      .then(messages => this.setState({ messages }));
  }

  onFormSubmit(messageBody) {
    return this.props.client.createMessage(messageBody);
  }

  topFiveMessages() {
    return [...this.state.messages].sort((a, b) => {
      if(this.props.client.getVotes(a.hash) > this.props.client.getVotes(b.hash)) {
        return -1;
      }

      if(this.props.client.getVotes(a.hash) < this.props.client.getVotes(b.hash)) {
        return 1;
      }

      return 0;
    }).slice(0, 5)
  }

  renderMessages() {
    if (this.state.messages.length === 0) return (<p>There are no messages.</p>);

    const messages = this.state.topFive ? this.topFiveMessages() : this.state.messages;

    return messages.map((message, index) => {
      return (
          <Message key={`${index}-${message.hash}`}
            hash={message.hash}
            votes={this.props.client.getVotes(message.hash)}
            type={"parent"}
            client={this.props.client}
            body={message.body} />);
    });
  }

  renderViewMessagesButton() {
    if(this.state.topFive) {
      return (<button onClick={() => this.setState({topFive: false})}>View All Messages</button>)
    } else {
      return (<button onClick={() => this.setState({topFive: true})}>View Top Five Messages</button>)
    }
  }

  render() {
    return (
        <React.Fragment>
          <div>{this.renderViewMessagesButton()}</div>
          <div>{this.renderMessages()}</div>
          <MessageForm onSubmit={this.onFormSubmit.bind(this)} />
        </React.Fragment>
    );
  }
}

export default MessagesContainer;
