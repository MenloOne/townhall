pragma solidity^0.4.18;

import 'zeppelin-solidity/contracts/token/PausableToken.sol';
/*
/ installed apps are cheaper on gas than approve/transferFrom because they require fewer SSTOREs
/
/ app installation works with a simple trustee system that assumes no two trustees would collude to rob token holders
/ the trustee system relies on mutual distrust
/ trustees should not:
/ * nominate(0x0)
/   - boarding 0x0 gives unilateral authority to all remaining board members
/   - the second board member to nominate 0x0 is the first with unilateral authority, so colluding is uneconomic
/   - if someone nominates 0x0, you must immediately revoke(0x0) and denounce the malicious party
/ * let an individual control two trustee accounts
/   - an individual with two accounts has unilateral power
/   - if someone loses their key, revoke the initial account before issuing another
/ * nominate an app before that app finishes third-party auditing
/   - malicious applications can spam microtransactions to steal tokens
/ * let the number of living trustees fall below 3
/   - death is unpredictable
/   - an individual trustee is powerless
/ the trustee system is trustful and should be replaced
/ to fully-replace the trustee system with a new governing contract:
/ * a.nominate(replacement)
/ * b.nominate(replacement)
/ * a.nominate(0x0)
/ * replacement.nominate(0x0)
/ * replacement.denounce(a)
/ * replacement.denounce(b)
*/
contract AppTokenEvents {
    event StartRequest(address app, address approver);
    event Installed(address app);
    event StopRequest(address app, address stopper);
    event Uninstalled(address app);
    event Board(address board);
    event Revoked(address board);
    event Nominated(address nominee, address nominator);
    event Denounced(address denouncee, address denouncer);
}
contract AppToken is AppTokenEvents,PausableToken {
    // Permissions Bitmap:
    uint8 constant INSTALLED = 1;
    uint8 constant BOARD = 2;

    mapping (address => Account) accounts;
    struct Account {
        uint8 permissions;
        address installer;
        address stopper;
        address nominator;
        address denouncer;
    }

    function appTransfer(address _from, address _to, uint256 _value) external onlyInstalled whenNotPaused {
        // microtransactions only
        require(_value <= 100 ether);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        Transfer(_from, _to, _value);
    }

    function AppToken(address trustee1, address trustee2, address trustee3) public {
        accounts[trustee1].permissions = BOARD;
        accounts[trustee2].permissions = BOARD;
        accounts[trustee3].permissions = BOARD;
        Board(trustee1);
        Board(trustee2);
        Board(trustee3);
    }

    function installed(address _app) public view returns (bool) {
        return accounts[_app].permissions & INSTALLED != 0;
    }

    modifier onlyInstalled {
        require(installed(msg.sender));
        _;
    }

    modifier onlyBoard {
        require(accounts[msg.sender].permissions & BOARD != 0);
        _;
    }

    function nominate(address _board) external onlyBoard {
        Account storage nominee = accounts[_board];
        if (nominee.permissions & BOARD != 0) {
            return;
        }
        if (nominee.nominator == msg.sender) {
            return;
        }
        Nominated(_board, msg.sender);
        if (accounts[nominee.nominator].permissions & BOARD == 0) {
            nominee.nominator = msg.sender;
            return;
        }
        nominee.permissions |= BOARD;
        Board(_board);
    }

    function revoke(address _board) external onlyBoard {
        Account storage denounced = accounts[_board];
        if (denounced.nominator != 0) {
            denounced.nominator = 0;
        }
        if (denounced.permissions & BOARD == 0) {
            return;
        }
        if (denounced.denouncer == msg.sender) {
            return;
        }
        Denounced(_board, msg.sender);
        if (accounts[denounced.denouncer].permissions & BOARD == 0) {
            denounced.denouncer = msg.sender;
            return;
        }
        denounced.permissions &= ~BOARD;
        Revoked(_board);
    }

    function install(address _app) external onlyBoard {
        Account storage application = accounts[_app];
        if (application.permissions & INSTALLED != 0) {
            return;
        }
        if (application.installer == msg.sender) {
            return;
        }
        StartRequest(_app, msg.sender);
        if (accounts[application.installer].permissions & BOARD == 0) {
            application.installer = msg.sender;
            return;
        }
        uint256 size;
        assembly {
            size := extcodesize(_app)
        }
        require(size > 0);
        application.permissions |= INSTALLED;
        Installed(_app);
    }
    function uninstall(address _app) external onlyBoard {
        Account storage application = accounts[_app];
        if (application.installer != 0) {
            application.installer = 0;
        }
        if (application.permissions & INSTALLED == 0) {
            return;
        }
        if (application.stopper == msg.sender) {
            return;
        }
        StopRequest(_app, msg.sender);
        if (accounts[application.stopper].permissions & BOARD == 0) {
            application.stopper = msg.sender;
            return;
        }
        application.permissions &= ~INSTALLED;
        Uninstalled(_app);
    }
}
