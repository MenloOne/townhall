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
import AccountDetails from './AccountDetails';
import MessagesContainer from './MessagesContainer';
import PayoutsContainer from './PayoutsContainer';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: true };
  }

  componentDidMount() {
    this.refreshAccountDetails();
  }

  refreshAccountDetails() {
    this.props.client.getAccountDetails()
      .then(({ account, balance }) => this.setState({ account, balance, authenticated: true, isLoading: false }))
      .catch(() => this.setState({ authenticated: false, isLoading: false }));
  }

  render() {
    if (this.state.isLoading) return null;

    if (!this.state.authenticated) {
      return (
        <div className="App">
          Not connected to Ethereum. Use <a href="https://metamask.io/">Metamask</a>{' '}
          or <a href="https://github.com/ethereum/mist/releases">Mist</a> to connect
          to Ethereum.
        </div>
      )
    }

    return (
      <div className="App">
        <PayoutsContainer client={this.props.client} afterClaim={this.refreshAccountDetails.bind(this)} />
        <MessagesContainer client={this.props.client} />
        <AccountDetails account={this.state.account} balance={this.state.balance} />
      </div>
    );
  }
}

export default App;
