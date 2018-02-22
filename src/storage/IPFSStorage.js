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
        let messageInfo = Object.assign(message, {hash: result[0].hash})
        resolve(messageInfo);
      })
    });
  }
}

export default IPFSStorage;
