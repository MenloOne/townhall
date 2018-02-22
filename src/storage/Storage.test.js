import MemoryStorage from './MemoryStorage';
import IPFSStorage from './IPFSStorage';

function testStorage(klass) {
  describe(klass.name, () => {
    describe('createMessage()', () => {
      it('promises a hash identifier', done => {
        let storage = new klass();

        storage.createMessage({body: "My new message"}).then((result) => {
          expect(result).toBeTruthy();
          done();
        })
      });
    });

    describe('findMessage(hash)', () => {
      it('promises the message', done => {
        let storage = new klass();
        let message = {body: "My new message"};

        storage.createMessage(message).then((createResult) => {
          storage.findMessage(createResult).then((findResult) => {
            expect(findResult).toEqual(message);
            done();
          });
        });
      });
    });
  });
}

testStorage(MemoryStorage);
testStorage(IPFSStorage);
