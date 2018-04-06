import React from 'react';
import { shallow } from 'enzyme';
import AccountDetails from './AccountDetails';

describe('AccountDetails', () => {
  it('renders the account hash and balance', () => {
    const accountDetails = shallow(<AccountDetails account={'someHash'} balance={'someBalance'} />);

    expect(accountDetails.text()).toEqual('someHash (someBalance MET)');
  });
});
