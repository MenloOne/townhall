class MemoryContract {
  constructor() {
    this.createMessage = this.createMessage.bind(this);
  }

  createMessage(hash) {
    console.log("Creating a message in contract!");
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

export default MemoryContract;
