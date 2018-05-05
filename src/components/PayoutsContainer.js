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

class PayoutsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      payouts: [],
      rewards: []
    }
  }

  componentDidMount() {
    this.refreshPayoutAccounts();

    this.props.client.getRewards().then(rewards => {
      this.setState({rewards: rewards})
    });
  }

  refreshPayoutAccounts() {
    this.props.client.getPayoutAccounts().then(payouts => {
      this.setState({payouts: payouts})
    });
  }

  claim(index) {
    this.props.client.claim(index).then(() => {
      this.refreshPayoutAccounts();
      this.props.afterClaim();
    });
  }

  renderPayoutItem(account, i) {
    if(account === this.props.client.account.toLowerCase()) {
      return (
        <li key={i}>
          {account}
          {' '}<button onClick={() => this.claim(i)}>Claim {this.state.rewards[i]} MET</button>
        </li>
      )
    }
  }

  render() {
    const payoutItems = this.state.payouts.map((account, i) => this.renderPayoutItem(account, i)).filter(i => i);

    if(payoutItems.length === 0) { return null };

    return (
      <div>
        <h1>Eligible Payouts</h1>

        <ol>
          {payoutItems}
        </ol>
      </div>
    );
  }
}

export default PayoutsContainer;
