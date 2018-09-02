/*
 * Copyright 2018 Vulcanize, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import multihash from 'multihashes';
import multihashing from 'multihashing-async';
import CID from 'cids';
import ipldDagCbor from 'ipld-dag-cbor';
import waterfall  from 'async/waterfall';

let thisExport = {};

thisExport.cidToSolidityHash = (cid) => {
  if(cid === '0x0') { return '0x0000000000000000000000000000000000000000000000000000000000000000' };

  return '0x' + multihash.decode(new CID(cid).multihash).digest.toString('hex');
}

thisExport.solidityHashToCid = (hash) => {
  if(hash === '0x0000000000000000000000000000000000000000000000000000000000000000') { return '0x0' };

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
