import SolidityHash from './SolidityHash';

describe('SolidityHash', () => {
  describe('fromCID(cid)', () => {
    it('returns a hex-formatted string that solidity accepts', () => {
      let hash = SolidityHash.fromCID('zdq6yPVTLJxshnQ28bDfFRKGJViLQ96vRc17oyU4bheRgD6YW')
      expect(hash).toEqual('0xb36371cef8870914066d214b276d5bc5fdbdcc759836bd1dfa15f494b9738e67')
    })
  });

  describe('toCID()', () => {
    it('returns a CID', () => {
      let cid = SolidityHash.toCID('0xb36371cef8870914066d214b276d5bc5fdbdcc759836bd1dfa15f494b9738e67');
      expect(cid).toEqual('zdq6yPVTLJxshnQ28bDfFRKGJViLQ96vRc17oyU4bheRgD6YW')
    })

    it('does not require a 0x prefix', () => {
      let cid = SolidityHash.toCID('b36371cef8870914066d214b276d5bc5fdbdcc759836bd1dfa15f494b9738e67');
      expect(cid).toEqual('zdq6yPVTLJxshnQ28bDfFRKGJViLQ96vRc17oyU4bheRgD6YW')
    })
  });
})
