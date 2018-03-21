import ipfsAPI from 'ipfs-api';

class RemoteIPFSStorage {
  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
    this.connection = ipfsAPI(connectionOptions);
  }

  pin(hash) {
    return this.connection.pin.add(hash).then(result => {
      return result && result.length > 0;
    })
  }
}

export default RemoteIPFSStorage;
