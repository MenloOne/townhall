import multihash from 'multihashes';
import multihashing from 'multihashing-async';
import CID from 'cids';
import ipldDagCbor from 'ipld-dag-cbor';
import waterfall  from 'async/waterfall';

let thisExport = {};

thisExport.cidToSolidityHash = (cid) => {
  return '0x' + multihash.decode(new CID(cid).multihash).digest.toString('hex');
}

thisExport.solidityHashToCid = (hash) => {
  let theHash = hash;

  if(hash.length === 66) {
    theHash = hash.slice(2, 66);
  }

  let encodedHash = multihash.encode(multihash.fromHexString(theHash), 'keccak-256');
  return new CID(1, 'dag-cbor', encodedHash).toBaseEncodedString();
}

thisExport.nodeToCID = (node, callback) => {
  return waterfall([
    (cb) => ipldDagCbor.util.serialize(node, cb),
    (serialized, cb) => multihashing(serialized, 'keccak-256', cb),
    (mh, cb) => cb(null, new CID(1, 'dag-cbor', mh))
  ], callback)
}

export default thisExport;
