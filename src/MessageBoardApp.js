class MessageBoardApp {
  constructor(props) {
    this.view = props.view;
    this.localStorage = props.localStorage;
    this.menloStorage = props.menloStorage;
    this.contract = props.contract;

    this.createMessage = this.createMessage.bind(this);
    this.viewMessages = this.viewMessages.bind(this);

    this.view.setState({
      onCreateMessage: this.createMessage
    });
  }

  viewMessages() {
    this.view.setState({
      messages: this.menloStorage.messages
    });
  }

  createMessage(messageBody) {
    let message = {
      version: "CONTRACT_VERSION",
      parent: "0",
      body: messageBody
    }
    };

    return this.localStorage.createMessage(message).then((messageHash) => {
      return this.contract.createMessage(messageHash);
    }).then((result) => {
      return this.menloStorage.createMessage(message);
    }).then(() => {
      this.viewMessages();
    });
  }
}

export default MessageBoardApp;
