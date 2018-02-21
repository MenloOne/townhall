class MessageBoardApp {
  constructor(props) {
    this.view = props.view;
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

  createMessage(message) {
    this.contract.createMessage(message);
    this.menloStorage.createMessage(message);
    this.viewMessages();
  }
}

export default MessageBoardApp;
