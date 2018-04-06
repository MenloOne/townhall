import React from 'react';

function AccountDetails(props) {
    return (
      <div>
        {`${props.account} (${props.balance} MET)`}
      </div>
    );
}

export default AccountDetails;
