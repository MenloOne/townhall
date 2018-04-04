import multihash from 'multihashes';
import CID from 'cids';

let SolidityHash = {};

SolidityHash.fromCID = (cid) => {
  return '0x' + multihash.decode(new CID(cid).multihash).digest.toString('hex');
}

SolidityHash.toCID = (hash) => {
  let theHash = hash;

  if(hash.length === 66) {
    theHash = hash.slice(2, 66);
  }

  let encodedHash = multihash.encode(multihash.fromHexString(theHash), 'keccak-256');
  return new CID(1, 'dag-cbor', encodedHash).toBaseEncodedString();
}

export default SolidityHash;
