import React from 'react';
import web3 from 'web3_override';
import truffleContract from 'truffle-contract';
import tokenContract from 'truffle_artifacts/contracts/Token.json';
import AccountDetails from './AccountDetails';
import MessageForm from './MessageForm';
import MessagesContainer from './MessagesContainer';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.token = truffleContract(tokenContract);
    this.state = { isLoading: true, messages: [] };
  }

  componentDidMount() {
    if(!web3) return;

    this.token.setProvider(web3.currentProvider);

    web3.eth.getAccounts((err, result) => {
      const account = result[0];
      if (!account) {
        this.setState({ authenticated: false, isLoading: false });
        return;
      }

      this.token.deployed()
        .then(i => i.balanceOf(account))
        .then(balance => {
          this.props.client.getLocalMessages()
            .then(messages => this.setState({ messages, account, balance, authenticated: true, isLoading: false }));
        });
    });
  }

  onFormSubmit(message) {
    try {
      return this.props.client.createMessage(message)
        .then(created => {
          this.setState({ error: null, messages: [...this.state.messages, message] });
        });
    }
    catch(error) {
      this.setState({ error: error.message });
    }
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
        {<MessagesContainer messages={this.state.messages} />}
        {<MessageForm onSubmit={this.onFormSubmit.bind(this)} error={this.state.error} />}
        {<AccountDetails account={this.state.account} balance={this.state.balance} />}
      </div>
    );
  }
}

export default App;
