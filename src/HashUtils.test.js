import HashUtils from './HashUtils';

describe('HashUtils', () => {
  describe('cidToSolidityHash(cid)', () => {
    it('returns a hex-formatted string that solidity accepts', () => {
      let hash = HashUtils.cidToSolidityHash('zdq6yPVTLJxshnQ28bDfFRKGJViLQ96vRc17oyU4bheRgD6YW')
      expect(hash).toEqual('0xb36371cef8870914066d214b276d5bc5fdbdcc759836bd1dfa15f494b9738e67')
    })
  });

  describe('solidityHashToCid()', () => {
    it('returns a CID', () => {
      let cid = HashUtils.solidityHashToCid('0xb36371cef8870914066d214b276d5bc5fdbdcc759836bd1dfa15f494b9738e67');
      expect(cid).toEqual('zdq6yPVTLJxshnQ28bDfFRKGJViLQ96vRc17oyU4bheRgD6YW')
    })

    it('does not require a 0x prefix', () => {
      let cid = HashUtils.solidityHashToCid('b36371cef8870914066d214b276d5bc5fdbdcc759836bd1dfa15f494b9738e67');
      expect(cid).toEqual('zdq6yPVTLJxshnQ28bDfFRKGJViLQ96vRc17oyU4bheRgD6YW')
    })
  });

  describe('nodeToCID(node)', () => {
    it('returns a CID using keccak-256 algorithm', (done) => {
      let node = { name: "forum root" }
      HashUtils.nodeToCID(node, (err, cid) => {
        expect(cid.toBaseEncodedString()).toEqual('zdq6yPVTLJxshnQ28bDfFRKGJViLQ96vRc17oyU4bheRgD6YW')
        done()
      })
    })
  })
})
