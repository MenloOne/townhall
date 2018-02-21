class MemoryStorage {
  constructor() {
    this.messages = [];
    this.nextIDCounter = 0;
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
