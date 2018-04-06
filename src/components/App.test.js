import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import AccountDetails from './AccountDetails';
import MessagesContainer from './MessagesContainer';

describe('App', () => {
  const account = 'someAccount';
  const balance = 'someBalance';

  describe('successful retrieval of account details', () => {
    let client, app;

    beforeEach(() => {
      client = {
        getAccountDetails: jest.fn(() => Promise.resolve({ account, balance }))
      };

      app = shallow(<App client={client} />);
    });

    it('renders the MessagesContainer and AccountDetails', () => {
      app.update();

      expect(client.getAccountDetails).toHaveBeenCalled();

      const messagesContainer = app.find(MessagesContainer);
      expect(messagesContainer.exists()).toEqual(true);
      expect(messagesContainer.props()).toEqual({ client });

      const accountDetails = app.find(AccountDetails);
      expect(accountDetails.exists()).toEqual(true);
      expect(accountDetails.props()).toEqual({ account, balance });
    });
  });


  describe('unsuccessful retrieval of account details', () => {
    let client, app;

    beforeEach(() => {
      client = {
        getAccountDetails: jest.fn(() => Promise.reject())
      };

      app = shallow(<App client={client} />);
    });

    it('renders the MessagesContainer and AccountDetails', () => {
      app.update();

      expect(client.getAccountDetails).toHaveBeenCalled();
      expect(app.find(MessagesContainer).exists()).toEqual(false);
      expect(app.find(AccountDetails).exists()).toEqual(false);
      expect(app.text()).toContain('Not connected to Ethereum');
    });
  });
});
