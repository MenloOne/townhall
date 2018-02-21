class MemoryStorage {
  constructor() {
    this.messages = [];
    this.nextIDCounter = 0;

    this.createMessage("Message 1");
    this.createMessage("Message 2");
    this.createMessage("Message 3");
  }

  nextID() {
    this.nextIDCounter += 1;
    return this.nextIDCounter;
  }

  createMessage(message) {
    var newMessage = {hash: this.nextID(), body: message};
    this.messages.push(newMessage);

    return new Promise((resolve, reject) => {
      resolve(newMessage);
    });
  }
}

export default MemoryStorage;
