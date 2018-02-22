import MemoryContract from './MemoryContract';

function testStorage(klass) {
  describe(klass.name, () => {
    describe('createMessage(hash)', () => {
      it('promises true', done => {
        let contract = new klass();

        contract.createMessage('myHash').then((result) => {
          expect(result).toBe(true);
          done();
        })
      });
    });
  });
}

testStorage(MemoryContract);
