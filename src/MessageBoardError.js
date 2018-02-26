class MessageBoardError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'MessageBoardError';
  }
}

export default MessageBoardError;
