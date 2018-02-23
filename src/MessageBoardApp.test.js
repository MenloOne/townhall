import MessageBoardApp from './MessageBoardApp';

describe(MessageBoardApp, () => {
  describe('createMessage(messageBody)', () => {
    describe('successful', () => {
      it('creates the message on local storage', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        let menloStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage("test message").then(() => {
          expect(localStorage.createMessage).toHaveBeenCalledWith({
            version: "CONTRACT_VERSION",
            parent: "0",
            body: "test message"
          });
          done();
        });
      });

      it('creates the message on the contract using the IPFS hash', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        let menloStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage("test message").then(() => {
          expect(contract.createMessage).toHaveBeenCalledWith('localHash');
          done();
        });
      });

      it('creates the message on menlo storage', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        let menloStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage("test message").then(() => {
          expect(menloStorage.createMessage).toHaveBeenCalledWith({
            version: "CONTRACT_VERSION",
            parent: "0",
            body: "test message"
          });
          done();
        });
      });

      it('refreshes the messages view', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        let menloStorage = {createMessage: jest.fn(() => Promise.resolve('localHash')), messages: ['message 1', 'message 2']};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage("test message").then(() => {
          expect(view.setState).toHaveBeenLastCalledWith({messages: ['message 1', 'message 2']});
          done();
        });
      });
    })
  });
});
