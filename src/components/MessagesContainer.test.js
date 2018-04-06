import React from 'react';
import { shallow } from 'enzyme';
import Message from './Message';
import MessageForm from './MessageForm';
import MessagesContainer from './MessagesContainer';

describe('MessagesContainer', () => {
  const messages = ['message1', 'message2'];
  let client, messagesContainer;

  beforeEach(() => {
    client = {
      getLocalMessages: jest.fn(() => Promise.resolve(['message1', 'message2'])),
      createMessage: jest.fn(() => Promise.resolve('someMessageHash'))
    };

    messagesContainer = shallow(<MessagesContainer client={client} />);
  });

  it('renders a placeholder if there are no messages retrieved from the client', () => {
    client = {
      getLocalMessages: jest.fn(() => Promise.resolve([]))
    };

    messagesContainer = shallow(<MessagesContainer client={client} />);

    const components = messagesContainer.find(Message);
    expect(components.exists()).toEqual(false);
    expect(messagesContainer.text()).toContain('There are no messages.');
  });

  it('renders a Message for each message retrieved from the client', () => {
    messagesContainer.update();

    const components = messagesContainer.find(Message);

    expect(components.length).toEqual(messages.length);
  });

  it('renders a MessageForm', () => {
    const instance = messagesContainer.instance();
    instance.setState = jest.fn();

    const messageForm = messagesContainer.find(MessageForm);

    expect(messageForm.exists()).toEqual(true);
    expect(messageForm.props()).toEqual({ onSubmit: expect.any(Function) });

    return messageForm.props().onSubmit('someMessageBody')
      .then(() => {
        expect(client.createMessage).toHaveBeenCalledWith('someMessageBody');
        expect(instance.setState).toHaveBeenCalledWith({
          messages: [...messages, { body: 'someMessageBody', hash: 'someMessageHash' }]
        });
      });
  });
});
