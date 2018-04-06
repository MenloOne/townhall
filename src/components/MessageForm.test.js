import React from 'react';
import { shallow } from 'enzyme';
import MessageForm from './MessageForm';

describe('MessageForm', () => {
  it('renders a form to submit a message', () => {
    const onSubmit = jest.fn(() => Promise.resolve());
    const messageForm = shallow(<MessageForm onSubmit={onSubmit} />);

    const input = messageForm.find('input[type="text"]');
    input.simulate('change', { target: { value: 'example message' } });

    expect(messageForm.state().message).toEqual('example message');

    const submitEvent = { preventDefault: jest.fn() };
    messageForm.find('form').simulate('submit', submitEvent);

    expect(submitEvent.preventDefault).toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith('example message');
  });
});
