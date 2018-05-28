/*
 * 
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

class MessageForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { message: '', disabled: false };
  }

  onSubmit(event) {
    event.preventDefault();
    this.setState({ disabled: true });

    this.props.onSubmit(this.state.message)
      .then(() => {
        if (this.props.type !== "Response") this.setState({ message: '', disabled: false, error: null });
      })
      .catch(error => this.setState({ error: error.message }));
  }

  onChange(event) {
    this.setState({ message: event.target.value });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>
          {this.props.type ? `${this.props.type}: ` : "Message: "}
          <input type="text" value={this.state.message} onChange={this.onChange.bind(this)} />
          <input type="submit" value="Send" disabled={this.state.disabled} />
        </label>
        {this.state.error && <p className="error">{this.state.error}</p>}
      </form>
    );
  }
}

export default MessageForm;
