/*
 * Copyright 2018 Vulcanize, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
