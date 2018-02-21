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
    this.messages.push({id: this.nextID(), body: message})
  }
}

export default MemoryStorage;
