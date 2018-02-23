class MessageBoardError extends Error {
  constructor(...args) {
    super(...args);
    this.name = this.constructor.name;
  }
}

class LocalIPFSError extends MessageBoardError { }
class ContractError extends MessageBoardError { }
class MenloIPFSError extends MessageBoardError { }

export {LocalIPFSError, ContractError, MenloIPFSError};
