class MessageBoardError extends Error {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
  }
}

export default MessageBoardError;
