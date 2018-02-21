class MessageBoardStorage {
  constructor() {
    this.messages = [];
    this.nextIDCounter = 0;

    this.createMessage("Storage message 1");
    this.createMessage("Storage message 2");
    this.createMessage("Storage message 3");
  }

  nextID() {
    this.nextIDCounter += 1;
    return this.nextIDCounter;
  }

  createMessage(message) {
    this.messages.push({id: this.nextID(), body: message})
  }
}

export default MessageBoardStorage;
