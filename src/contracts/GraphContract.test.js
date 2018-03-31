import MemoryContract from './MemoryContract';

function testStorage(klass) {
  describe(klass.name, () => {
    describe('createMessage(hash, parent)', () => {
      it('promises true', done => {
        let contract = new klass();

        contract.createMessage('myHash', '0').then((result) => {
          expect(result).toBe(true);
          done();
        })
      });
    });
  });
}

testStorage(MemoryContract);
