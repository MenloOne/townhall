import MessageBoardApp from './MessageBoardApp';

describe('MessageBoardApp', () => {
  describe('createMessage(messageBody)', () => {
    describe('successful', () => {
      let view, localStorage, contract, menloStorage, graph, app;

      beforeEach(() => {
        view = {setOnCreateMessage: jest.fn(), setMessages: jest.fn(), messageSendSucceeded: jest.fn()};
        localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash')), findMessage: jest.fn((hash) => Promise.resolve(Object.assign({'message1': 'message 1', 'message2': 'message 2'})[hash]))};
        contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        menloStorage = {pin: jest.fn(() => Promise.resolve(true))};
        graph = {addNode: jest.fn(() => true), children: jest.fn(() => ['message1', 'message2'])}
        app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, graph: graph, contract: contract});
      });

      it('creates the message on local storage', done => {
        app.createMessage("test message").then(() => {
          expect(localStorage.createMessage).toHaveBeenCalledWith({
            version: "CONTRACT_VERSION",
            parent: "0",
            body: "test message"
          });
          done();
        });
      });

      it('creates the message on the contract using the IPFS hash and the root parent', done => {
        app.createMessage("test message").then(() => {
          expect(contract.createMessage).toHaveBeenCalledWith('localHash', '0');
          done();
        });
      });

      it('adds the message hash to the graph with the root parent', done => {
        app.createMessage("test message").then(() => {
          expect(graph.addNode).toHaveBeenCalledWith('localHash', '0');
          done();
        });
      })

      it('pins the message on menlo storage using the IPFS hash', done => {
        app.createMessage("test message").then(() => {
          expect(menloStorage.pin).toHaveBeenCalledWith('localHash');
          done();
        });
      });

      it('notifies the view that the message was sent successfully', done => {
        app.createMessage("test message").then(() => {
          expect(view.messageSendSucceeded).toHaveBeenCalledWith();
          done();
        });
      })

      it('looks up the top-level messages from local storage', done => {
        app.createMessage("test message").then(() => {
          expect(localStorage.findMessage).toHaveBeenCalledWith("message1")
          expect(localStorage.findMessage).toHaveBeenCalledWith("message2")
          done();
        });
      })

      it('refreshes the messages view', done => {
        app.createMessage("test message").then(() => {
          expect(view.setMessages).toHaveBeenCalledWith(['message 1', 'message 2']);
          done();
        });
      });
    })

    // For failure paths, I could explicitly check that the remaining functions don't get called,
    // but I think it's simpler to just not define them at all and let it blow up if they're called
    describe('local storage fails', () => {
      it('updates the view with an error message', done => {
        let view = {setOnCreateMessage: jest.fn(), messageSendFailed: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.reject('local storage failed'))};
        let contract = {};
        let menloStorage = {};
        let graph = {addNode: jest.fn(() => true)};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, graph: graph, contract: contract});

        app.createMessage('test message').then(() => {
          expect(view.messageSendFailed).toHaveBeenCalledWith('An error occurred saving the message to your local IPFS.');
          done();
        });
      });
    });

    describe('contract fails', () => {
      it('updates the view with an error message', done => {
        let view = {setOnCreateMessage: jest.fn(), messageSendFailed: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.reject('contract failed'))};
        let menloStorage = {};
        let graph = {addNode: jest.fn(() => true)};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, graph: graph, contract: contract});

        app.createMessage('test message').then(() => {
          expect(view.messageSendFailed).toHaveBeenLastCalledWith('An error occurred verifying the message.');
          done();
        });
      });
    });

    describe('pinning on menlo storage fails', () => {
      it('updates the view with an error message', done => {
        let view = {setOnCreateMessage: jest.fn(), messageSendFailed: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        let menloStorage = {pin: jest.fn(() => Promise.reject('menlo storage failed'))};
        let graph = {addNode: jest.fn(() => true)};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, graph: graph, contract: contract});

        app.createMessage('test message').then(() => {
          expect(view.messageSendFailed).toHaveBeenLastCalledWith('An error occurred saving the message to Menlo IPFS.');
          done();
        });
      });
    });
  });
});
