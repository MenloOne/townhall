class MessageBoardApp {
  constructor(props) {
    this.view = props.view;
    this.localStorage = props.localStorage;
    this.menloStorage = props.menloStorage;
    this.contract = props.contract;

    this.view.setState({
      onCreateMessage: this.createMessage.bind(this)
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

    this.localStorage.createMessage(message).then((messageHash) => {
      this.contract.createMessage(messageHash).then((result) => {
        this.menloStorage.createMessage(message).then((ignoreThis) => {
          this.viewMessages();
        });
      });
    });
  }
}

export default MessageBoardApp;
