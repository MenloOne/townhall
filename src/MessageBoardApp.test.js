import MessageBoardApp from './MessageBoardApp';
import {LocalIPFSError, ContractError, MenloIPFSError} from 'MessageBoardErrors';

describe('MessageBoardApp', () => {
  describe('createMessage(messageBody)', () => {
    describe('successful', () => {
      let view, localStorage, contract, menloStorage, app;

      beforeEach(() => {
        view = {setState: jest.fn()};
        localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        menloStorage = {createMessage: jest.fn(() => Promise.resolve('localHash')), messages: ['message 1', 'message 2']};
        app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});
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

      it('creates the message on the contract using the IPFS hash', done => {
        app.createMessage("test message").then(() => {
          expect(contract.createMessage).toHaveBeenCalledWith('localHash');
          done();
        });
      });

      it('creates the message on menlo storage', done => {
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
        app.createMessage("test message").then(() => {
          expect(view.setState).toHaveBeenLastCalledWith({messages: ['message 1', 'message 2']});
          done();
        });
      });
    })

    // For failure paths, I could explicitly check that the remaining functions don't get called,
    // but I think it's simpler to just not define them at all and let it blow up if they're called
    describe('local storage fails', () => {
      it('updates the view with an error message', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.reject(new LocalIPFSError()))};
        let contract = {};
        let menloStorage = {};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage('test message').then(() => {
          expect(view.setState).toHaveBeenLastCalledWith({error: {on: 'createMessage', message: 'An error occurred saving the message to your local IPFS.'}});
          done();
        });
      });
    });

    describe('contract fails', () => {
      it('updates the view with an error message', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.reject(new ContractError()))};
        let menloStorage = {};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage('test message').then(() => {
          expect(view.setState).toHaveBeenLastCalledWith({error: {on: 'createMessage', message: 'An error occurred verifying the message.'}});
          done();
        });
      });
    });

    describe('menlo storage fails', () => {
      it('updates the view with an error message', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.resolve('localHash'))};
        let contract = {createMessage: jest.fn(() => Promise.resolve(true))};
        let menloStorage = {createMessage: jest.fn(() => Promise.reject(new MenloIPFSError()))};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage('test message').then(() => {
          expect(view.setState).toHaveBeenLastCalledWith({error: {on: 'createMessage', message: 'An error occurred saving the message to Menlo IPFS.'}});
          done();
        });
      });
    });

    describe('some other error occurs', () => {
      it('updates the view with an error message', done => {
        let view = {setState: jest.fn()};
        let localStorage = {createMessage: jest.fn(() => Promise.reject(new Error('funky')))};
        let contract = {};
        let menloStorage = {};
        let app = new MessageBoardApp({view: view, localStorage: localStorage, menloStorage: menloStorage, contract: contract});

        app.createMessage('test message').then(() => {
          expect(view.setState).toHaveBeenLastCalledWith({error: {on: 'createMessage', message: 'An unknown error occurred.'}});
          done();
        });
      });
    });
  });
});
