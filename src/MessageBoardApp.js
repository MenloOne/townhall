import MessageBoardError from 'MessageBoardError';
import web3 from 'web3_override';
import TruffleContract from 'truffle-contract';
import TokenContract from 'truffle_artifacts/contracts/AppToken.json';

let Token = TruffleContract(TokenContract);

class MessageBoardApp {
  constructor(props) {
    this.view = props.view;
    this.localStorage = props.localStorage;
    this.menloStorage = props.menloStorage;
    this.forum = props.forum;
    this.graph = props.graph;

    this.graph.addNode('0x0');

    this.view.setOnCreateMessage(this.createMessage);
  }

  viewMessages = async () => {
    let messageIDs = this.graph.children('0x0');
    let messages = await Promise.all(messageIDs.map((mid) => this.localStorage.findMessage(mid)));
    this.view.setMessages(messages);
  }

  showBalance = () => {
    if(!web3) { return }

    Token.setProvider(web3.currentProvider);
    web3.eth.getAccounts((err, result) => {
      let account = result[0];
      Token.deployed()
        .then(i => { return i.balanceOf(account) })
        .then(balance => this.view.updateBalance({ account: account, balance: balance.toString() }));
    });
  }

  createMessage = async (messageBody) => {
    let message = {
      version: "CONTRACT_VERSION",
      parent: "0x0",
      body: messageBody
    };

    try {
      let messageHash = await this.localStorage.createMessage(message)
        .catch(e => { throw new MessageBoardError('An error occurred saving the message to your local IPFS.') });
      await this.forum.post(messageHash, message.parent)
        .catch(e => { throw new MessageBoardError('An error occurred verifying the message.') });
      this.graph.addNode(messageHash, message.parent)
      await this.menloStorage.pin(messageHash)
        .catch(e => { throw new MessageBoardError('An error occurred saving the message to Menlo IPFS.') });
    }
    catch(e) {
      switch(e.name) {
        case MessageBoardError.name:
          this.view.messageSendFailed(e.message);
          return;
        default:
          throw e;
      }
    }

    this.view.messageSendSucceeded();
    await this.viewMessages();
  }
}

export default MessageBoardApp;
