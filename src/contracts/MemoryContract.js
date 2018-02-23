class MemoryContract {
  createMessage = (hash) => {
    return new Promise((resolve, reject) => {
      console.log("Creating a message in contract!");
      resolve(true);
    });
  }
}

export default MemoryContract;
