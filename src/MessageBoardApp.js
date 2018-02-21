class MessageBoardApp {
  constructor(props) {
    this.view = props.view;
    this.menloStorage = props.menloStorage;

    this.messages = [
      { id: 1, body: "App message 1" },
      { id: 2, body: "App message 2" },
      { id: 3, body: "App message 3" },
    ];

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
    this.menloStorage.createMessage(message);
    this.viewMessages();
  }
}

export default MessageBoardApp;
