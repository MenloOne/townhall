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

class Payout extends React.Component {
  constructor(props) {
    super(props);

    this.state = { reward: 0 }
    console.log(this.props.index);
  }

  componentDidMount() {
    this.props.client.getReward(this.props.index).then(r => this.setState({reward: r}))
  }

  claim() {
    this.props.client.claim(this.props.index).then(_ => this.setState({reward: 0}));
  }

  render() {
    if(this.state.reward === 0) { return null };

    return (
      <li>
        {this.props.account}
        {' '}<button onClick={this.claim.bind(this)}>Claim {this.state.reward} MET</button>
      </li>
    )
  }
}

export default Payout;
