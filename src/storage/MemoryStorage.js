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
    let theID = cid || this.nextID();
    this.messages[theID] = message;
    return Promise.resolve(theID);
  }

  findMessage(hash) {
    return Promise.resolve(this.messages[hash]);
  }
}

export default MemoryStorage;
