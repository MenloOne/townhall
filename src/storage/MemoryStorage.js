class MemoryStorage {
  constructor() {
    this.messages = [];
    this.nextIDCounter = 0;

    this.createMessage = this.createMessage.bind(this);

    this.createMessage({body: "Message 1"});
    this.createMessage({body: "Message 2"});
    this.createMessage({body: "Message 3"});
  }

  nextID() {
    this.nextIDCounter += 1;
    return this.nextIDCounter;
  }

  createMessage(message) {
    let messageID = this.nextID();
    this.messages[messageID] = message;

    return new Promise((resolve, reject) => {
      resolve(messageID);
    });
  }

  findMessage(hash) {
    return new Promise((resolve, reject) => {
      resolve(this.messages[hash]);
    });
  }
}

export default MemoryStorage;
