class MemoryContract {
  createMessage = (hash, parentHash) => {
    return Promise.resolve(true);
  }
}

export default MemoryContract;
