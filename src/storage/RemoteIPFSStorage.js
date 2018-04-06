import ipfsAPI from 'ipfs-api';

class RemoteIPFSStorage {
  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
    this.connection = ipfsAPI(connectionOptions);
  }

  pin(hash) {
    return this.connection.pin.add(hash).then(result => {
      if (result && result.length > 0) return hash;

      return Promise.reject();
    })
  }
}

export default RemoteIPFSStorage;
