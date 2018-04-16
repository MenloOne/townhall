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

    this.state = { messages: [] };
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
          <MessageForm onSubmit={this.onFormSubmit.bind(this)} />
        </React.Fragment>
    );
  }
}

export default MessagesContainer;
