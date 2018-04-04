import IPFS from 'ipfs';
import SolidityHash from 'SolidityHash';

class JavascriptIPFSStorage {
  constructor() {
    this.ipfs = new IPFS();
    this.messagesList = [];
    this.connectedToPeer = false;
  }

  createMessage(message) {
    return new Promise((resolve, reject) => {
      SolidityHash.nodeToCID(message, (err1, cid) => {
        this.ipfs.dag.put(message, {cid: cid}, (err2, result) => {
          this.messagesList.push(message);
          resolve(result.toBaseEncodedString());
        })
      })
    })
  }

  findMessage(hash) {
    return new Promise((resolve, reject) => {
      this.ipfs.dag.get(hash, (err, result) => {
        resolve(result.value);
      })
    })
  }

  connectPeer(remote) {
    this.ipfs.on('ready', () => {
      new Promise((resolve, reject) => {
        remote.connection.id((err, result) => {
          let wsAddress = result.addresses.find(a => a.includes('/ws/'));
          this.ipfs.swarm.connect(wsAddress, (connectErr, connectResult) => {
            if(connectErr) {
              reject(connectErr);
            } else {
              this.connectedToPeer = true;
              resolve();
            }
          })
        })
      })
    })
  }

  isOnline() {
    return this.ipfs.isOnline() && this.connectedToPeer;
  }
}

export default JavascriptIPFSStorage;
