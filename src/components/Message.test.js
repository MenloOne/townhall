import React from 'react';
import { shallow } from 'enzyme';
import Message from './Message';
import MessageForm from './MessageForm';

describe('Message', () => {
  let message, client;

  beforeEach(() => {
    client = {
      createMessage: jest.fn(() => Promise.resolve('newMessageHash')),
      getVotes: jest.fn(() => Promise.resolve(1))
    };
  })

  describe('parent message', () => {
    beforeEach(() => {
      message = shallow(<Message type={'parent'}
          client={client}
          body={'someMessageBody'}
          hash={'parentHash'} />);
    });

    it('renders the message body and reply action', () => {
      expect(message.find('.text').text()).toContain('someMessageBody');

      const reply = message.find('.actions .reply');
      expect(reply.exists()).toEqual(true);
      expect(reply.text()).toEqual('reply');
    });

    it('renders a MessageForm on clicking the reply link', () => {
      expect(message.find(MessageForm).exists()).toEqual(false);

      message.find('.actions .reply').simulate('click');

      const messageForm = message.find(MessageForm);
      expect(messageForm.exists()).toEqual(true);
      expect(messageForm.props()).toEqual({
        id: 'parentHash',
        type: 'Response',
        onSubmit: expect.any(Function)
      });
    });

    it('uses the client to create a message when submitting the MessageForm', () => {
      message.find('.actions .reply').simulate('click');
      const messageForm = message.find(MessageForm);
      const submit = messageForm.props().onSubmit;

      submit('someNewMessage');

      expect(client.createMessage).toHaveBeenCalledWith('someNewMessage', 'parentHash');
    });
  });

  describe('child message', () => {
    beforeEach(() => {
      message = shallow(<Message type={'child'}
          client={client}
          body={'someMessageBody'}
          hash={'childHash'} />);
    });

    it('only renders the message body', () => {
      expect(message.find('.text').text()).toContain('someMessageBody');
      expect(message.find('.actions .reply').exists()).toEqual(false);
    });
  });
});
