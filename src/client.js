import MessageBoardError from 'MessageBoardError';

class Client {
  constructor(graph, forum, localStorage, remoteStorage) {
    this.graph = graph;
    this.forum = forum;
    this.localStorage = localStorage;
    this.remoteStorage = remoteStorage;
  }

  getLocalMessages(nodeID) {
    const messageIDs = this.graph.children(nodeID || "0x0");

    return Promise.all(messageIDs.map(id => this.localStorage.findMessage(id)));
  }

  async createMessage(messageBody) {
    const message = {
      version: "CONTRACT_VERSION",
      parent: "0x0",
      body: messageBody
    };

    const messageHash = await this.localStorage.createMessage(message)
      .catch(e => { throw new MessageBoardError('An error occurred saving the message to your local IPFS.') });

    await this.forum.post(messageHash, message.parent)
      .catch(e => { throw new MessageBoardError('An error occurred verifying the message.') });

    this.graph.addNode(messageHash, message.parent);

    return this.remoteStorage.pin(messageHash)
      .catch(e => { throw new MessageBoardError('An error occurred saving the message to Menlo IPFS.') });
  }
}

export default Client;
