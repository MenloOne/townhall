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

    return ipfsPromise.then(result => {
      return result[0].hash;
    });
  }

  findMessage(hash) {
    let ipfsPromise = this.connection.cat(hash);

    return ipfsPromise.then(result => {
      return JSON.parse(result.toString());
    });
  }
}

export default IPFSStorage;
