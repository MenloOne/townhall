import MessageBoardError from 'MessageBoardError';

class MessageBoardApp {
  constructor(props) {
    this.view = props.view;
    this.localStorage = props.localStorage;
    this.menloStorage = props.menloStorage;
    this.contract = props.contract;

    this.view.setOnCreateMessage(this.createMessage);
  }

  viewMessages = () => {
    this.view.setMessages(this.menloStorage.messages);
  }

  createMessage = async (messageBody) => {
    let message = {
      version: "CONTRACT_VERSION",
      parent: "0",
      body: messageBody
    };

    try {
      let messageHash = await this.localStorage.createMessage(message)
        .catch(e => { throw new MessageBoardError('An error occurred saving the message to your local IPFS.') });
      await this.contract.createMessage(messageHash)
        .catch(e => { throw new MessageBoardError('An error occurred verifying the message.') });
      await this.menloStorage.createMessage(message)
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
    this.viewMessages();
  }
}

export default MessageBoardApp;
