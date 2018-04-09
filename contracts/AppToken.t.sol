pragma solidity^0.4.18;

import "ds-test/test.sol";
import "./AppToken.sol";

contract SomeGuy {
    AppToken token;
    function SomeGuy(AppToken _token) public {
        setToken(_token);
    }
    function setToken(AppToken _token) public {
        token = _token;
    }
    function nominate(address _guy) external {
        token.nominate(_guy);
    }
    function revoke(address _guy) external {
        token.revoke(_guy);
    }
    function install(address _app) external {
        token.install(_app);
    }
    function uninstall(address _app) external {
        token.uninstall(_app);
    }
    function appTransfer(address _from, address _to, uint256 _amount) {
        token.appTransfer(_from, _to, _amount);
    }
}
contract AppTokenMock is AppToken {
    function AppTokenMock(address one, address two, address three) AppToken(one,two,three) public {
        balances[msg.sender] = 1000000000 ether;
    }
}
contract ERC20Events {
    event Transfer(address from, address to, uint256 amount);
}
contract AppTokenTest is DSTest,AppTokenEvents,ERC20Events {
    AppToken token;
    SomeGuy admin1;
    SomeGuy admin2;
    function setUp() public {
        admin1 = someGuy();
        admin2 = someGuy();
        token = new AppTokenMock(this, admin1, admin2);
        admin1.setToken(token);
        admin2.setToken(token);
    }
    function someGuy() internal returns (SomeGuy) {
        return new SomeGuy(token);
    }
    function testFail_someGuyTriesToNominate() public {
        SomeGuy s1 = someGuy();
        s1.nominate(this);
    }
    function testFail_someGuyTriesToRevoke() public {
        SomeGuy s1 = someGuy();
        s1.revoke(this);
    }
    function test_adminsNominateNewAdmin() public {
        SomeGuy nominee = someGuy();
        expectEventsExact(token);

        Nominated(nominee, admin1);
        Nominated(nominee, admin2);
        Board(nominee);

        admin1.nominate(nominee);
        admin2.nominate(nominee);
    }
    function test_adminsRevokeAdmin() public {
        expectEventsExact(token);

        Denounced(this, admin1);
        Denounced(this, admin2);
        Revoked(this);

        admin1.revoke(this);
        admin2.revoke(this);
    }
    function testFail_revokedAdminNominate() public {
        admin1.revoke(this);
        admin2.revoke(this);
        token.nominate(this);
    }
    function testFail_someGuyAppTransfer() public {
        someGuy().appTransfer(this, admin1, 1);
    }
    function testFail_adminAppTransfer() public {
        admin1.appTransfer(this, admin1, 1);
    }
    function test_appTransfer() public {
        SomeGuy app = someGuy();

        expectEventsExact(token);
        StartRequest(app, admin1);
        StartRequest(app, admin2);
        Installed(app);
        Transfer(this, app, 20 finney);

        admin1.install(app);
        admin2.install(app);
        app.appTransfer(this, app, 20 finney);
    }
    function testFail_appRevoke() public {
        SomeGuy app = someGuy();
        admin1.install(app);
        admin2.install(app);
        app.revoke(admin1);
    }
    function test_nominatorRevoked() public {
        SomeGuy app = someGuy();

        expectEventsExact(token);
        StartRequest(app, this);
        Denounced(this, admin1);
        Denounced(this, admin2);
        Revoked(this);
        StartRequest(app, admin1);
        StartRequest(app, admin2);
        Installed(app);

        token.install(app);
        admin1.revoke(this);
        admin2.revoke(this);
        admin1.install(app);
        admin2.install(app);
    }
    function test_nomineeRevoked() public {
        SomeGuy app = someGuy();

        expectEventsExact(token);
        StartRequest(app, this);
        Denounced(app, admin1);
        StartRequest(app, admin1);
        StartRequest(app, admin2);
        Installed(app);

        token.install(app);
        admin1.uninstall(app);
        admin1.install(app);
        admin2.install(app);
    }
}
