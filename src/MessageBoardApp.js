import {LocalIPFSError, ContractError, MenloIPFSError} from 'MessageBoardErrors';

class MessageBoardApp {
  constructor(props) {
    this.view = props.view;
    this.localStorage = props.localStorage;
    this.menloStorage = props.menloStorage;
    this.contract = props.contract;

    this.view.setState({
      onCreateMessage: this.createMessage
    });
  }

  viewMessages = () => {
    this.view.setState({
      messages: this.menloStorage.messages
    });
  }

  createMessage = (messageBody) => {
    let message = {
      version: "CONTRACT_VERSION",
      parent: "0",
      body: messageBody
    };

    let displayError = (message) => this.view.setState({error: {on: 'createMessage', message: message}});

    return this.localStorage.createMessage(message)
      .then(this.contract.createMessage)
      .then(() => this.menloStorage.createMessage(message))
      .then(() => this.viewMessages())
      .catch(error => {
        switch(error.name) {
          case LocalIPFSError.name:
            displayError('An error occurred saving the message to your local IPFS.');
            break;
          case ContractError.name:
            displayError('An error occurred verifying the message.');
            break;
          case MenloIPFSError.name:
            displayError('An error occurred saving the message to Menlo IPFS.');
            break;
          default:
            displayError('An unknown error occurred.');
        }
      });
  }
}

export default MessageBoardApp;
