import MemoryStorage from './MemoryStorage';
import IPFSStorage from './IPFSStorage';

function testStorage(klass) {
  describe(klass.name, () => {
    describe('createMessage()', () =>{
      it('promises a hash identifier', done => {
        let storage = new klass();

        storage.createMessage({body: "My new message"}).then((result) => {
          expect(result.hash).toBeTruthy();
          done();
        })
      });

      it('maintains the message body', done => {
        let storage = new klass();

        storage.createMessage({body: "My new message"}).then((result) => {
          expect(result.body).toEqual("My new message");
          done();
        })
      });
    });
  });
}

testStorage(MemoryStorage);
testStorage(IPFSStorage);
