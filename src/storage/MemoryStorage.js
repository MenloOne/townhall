class MemoryStorage {
  constructor() {
    this.messages = {};
    this.nextIDCounter = 0;
  }

  nextID() {
    this.nextIDCounter += 1;
    return this.nextIDCounter;
  }

  createMessage = (message, cid) => {
    this.messages[cid] = message;
    return Promise.resolve(true);
  }

  findMessage(hash) {
    return this.messages[hash];
  }
}

export default MemoryStorage;
