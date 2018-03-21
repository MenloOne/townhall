import ipfsAPI from 'ipfs-api';
import dagCBOR from "ipld-dag-cbor"

class IPFSStorage {
  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
    this.connection = ipfsAPI(connectionOptions);
  }

  createMessage(message) {
    return new Promise(resolve => {
      dagCBOR.util.serialize(message, (err, serialized) => {
        this.connection.add(serialized, {'cid-version': '1'}).then(result => {
          resolve(result[0].hash)
        })
      })
    })
  }

  findMessage(hash) {
    let ipfsPromise = this.connection.cat(hash);

    return new Promise(resolve => {
      ipfsPromise.then(result => {
        dagCBOR.util.deserialize(result, (err, object) => resolve(object))
      })
    })
  }
}

export default IPFSStorage;
