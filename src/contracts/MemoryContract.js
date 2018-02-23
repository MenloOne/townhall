class MemoryContract {
  createMessage = (hash) => {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}

export default MemoryContract;
