import MemoryForum from './MemoryForum';

function testStorage(klass) {
  describe(klass.name, () => {
    describe('post(hash, parent)', () => {
      it('promises true', done => {
        let forum = new klass();

        forum.post('myHash', '0').then((result) => {
          expect(result).toBe(true);
          done();
        })
      });
    });
  });
}

testStorage(MemoryForum);
