import ipfsAPI from 'ipfs-api';
import {Buffer} from 'buffer';

class IPFSStorage {
  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
    this.connection = ipfsAPI(connectionOptions);
  }

  createMessage(message) {
    let messageBuffer = new Buffer(JSON.stringify(message));
    let ipfsPromise = this.connection.add(messageBuffer);

    return new Promise((resolve, reject) => {
      ipfsPromise.then(result => {
        resolve(result[0]);
      })
    });
  }
}

export default IPFSStorage;
