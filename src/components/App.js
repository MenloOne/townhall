import React from 'react';
import AccountDetails from './AccountDetails';
import MessagesContainer from './MessagesContainer';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isLoading: true };
  }

  componentDidMount() {
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
        <MessagesContainer client={this.props.client} />
        <AccountDetails account={this.state.account} balance={this.state.balance} />
      </div>
    );
  }
}

export default App;
