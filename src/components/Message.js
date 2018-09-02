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
import MessageForm from './MessageForm';
import './Message.css';

class Message extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showReplyForm: false, showReplies: false, children: [], votes: this.props.votes || 0, upvote: 0, downvote: 0 };
  }

  showReplyForm() {
    this.setState({ showReplyForm: true });
  }

  reply = async (messageBody) => {
    return this.props.client.createMessage(messageBody, this.props.hash)
      .then(async messageHash => {
        const child = (
            <Message key={`${this.state.children.length}-${messageHash}`}
              hash={messageHash}
              votes={this.props.client.getVotes(messageHash)}
              type={"child"}
              client={this.props.client}
              body={messageBody} />);

        await this.showReplies(true);
        this.setState({ children: [...this.state.children, child], showReplyForm: false });
      });
  }

  upvote() {
    this.props.client.upvote(this.props.hash)
      .then(r => {
        this.setState({
          votes: this.state.votes + 1 + this.state.downvote,
          downvote: 0,
          upvote: 1
        });
      })
  }

  downvote() {
    this.props.client.downvote(this.props.hash)
    .then(r => {
      this.setState({
        votes: this.state.votes - 1 - this.state.upvote,
        downvote: 1,
        upvote: 0
      });
    })
  }

  countReplies() {
    return this.state.children.length > 0 ? this.state.children.length : this.props.client.countReplies(this.props.hash);
  }

  showReplies = async (show) => {
    if(!show) { this.setState({showReplies: false}); return }

    await this.props.client.getLocalMessages(this.props.hash).then(replies => {
      const replyItems = replies.map(r => {
        return <Message key={r.hash}
          hash={r.hash}
          votes={this.props.client.getVotes(r.hash)}
          type={"child"}
          client={this.props.client}
          body={r.body} />;
      });

      this.setState({children: replyItems, showReplies: true});
    });
  }

  messageStatus() {
    return this.props.client.topicOffset(this.props.hash) ? "complete" : "pending";
  }

  messageComplete() {
    return this.messageStatus() === "complete";
  }

  messagePending() {
    return this.messageStatus() === "pending";
  }

  render() {
    return (
        <div className={`message ${this.props.type}`}>
          <div className="text">{this.props.body}</div>
          {this.state.votes > 0 && <div className="votes">votes: {this.state.votes}</div>}
          <div className="actions">
            {this.props.type === "parent" && this.messageComplete() && <a className="reply" onClick={this.showReplyForm.bind(this)}>reply</a>}
            {' '}{this.state.upvote === 0 && this.messageComplete() && <a onClick={this.upvote.bind(this)}>++</a>}
            {' '}{this.state.downvote === 0 && this.messageComplete() && <a onClick={this.downvote.bind(this)}>--</a>}
            {' '}{this.props.type === "parent" && this.countReplies() > 0 && <a onClick={() => this.showReplies(!this.state.showReplies)}>{this.countReplies()} replies</a>}
          </div>
          {this.state.showReplyForm &&
            <MessageForm id={this.props.hash} type={"Response"} onSubmit={(message) => this.reply(message)} />}
          {this.state.showReplies && this.state.children}
        </div>
    );
  }
}

export default Message;
