pragma solidity^0.4.19;

import "./lottery.sol";
import "./AppToken.sol";
import "ds-test/test.sol";

contract LotteryMock is Lottery {
    function LotteryMock(AppToken _token, Forum _forum) Lottery(_token, _forum) public {}
    function setRewardPool(uint256 _rewardPool) public {
        rewardPool = _rewardPool;
    }
    uint256 _now;
    function warp(uint256 _warp) external {
        _now += _warp;
    }
    function era() internal view returns (uint256) {
        return _now;
    }
}
contract RedeemerMock is Redeemer {
    AppToken public from;
    AppToken public to;
    // the current version of solc does not recognize public vars as implementing public view methods
    function to() external view returns (AppToken) {
        return to;
    }
    function from() external view returns (AppToken) {
        return from;
    }
    function RedeemerMock(AppToken _from, AppToken _to) public {
        from = _from;
        to = _to;
    }
    function redeem() external {
        uint256 wad = from.balanceOf(msg.sender);
        from.transferFrom(msg.sender, this, wad);
        to.transfer(msg.sender, wad);
    }
    function undo() external {
        uint256 wad = to.balanceOf(msg.sender);
        to.transferFrom(msg.sender, this, wad);
        from.transfer(msg.sender, wad);
    }
}
contract Voter {
    Lottery lottery;
    Forum forum;
    AppToken token;
    function Voter (Lottery _lottery, Forum _forum, AppToken _token) public {
        lottery = _lottery;
        forum = _forum;
        token = _token;
    }
    function upvote(uint _index) external {
        lottery.upvote(_index);
    }
    function downvote(uint _index) external {
        lottery.downvote(_index);
    }
    function unvote(uint256 _index) external {
        lottery.unvote(_index);
    }
    function post() external {
        forum.post(0x0, 0x0);
    }
    function postAndUpvote() external {
        forum.postAndUpvote(0x0, 0x0);
    }
    function claim(uint8 _index) external {
        lottery.claim(_index);
    }
    function setToken(AppToken _to) external {
        token = _to;
    }
    function setForum(Forum _forum) external {
        forum = _forum;
    }
    function install(AppToken _token, address _app) external {
        _token.install(_app);
    }
    function redeem(Redeemer _redeemer) external {
        ERC20 from = _redeemer.from();
        ERC20 to = _redeemer.to();
        from.approve(_redeemer, from.balanceOf(this));
        _redeemer.redeem();
        to.approve(forum, to.balanceOf(this));
        to.approve(lottery, to.balanceOf(this));
    }
    function undo(Redeemer _redeemer) external {
        ERC20 from = _redeemer.from();
        ERC20 to = _redeemer.to();
        to.approve(_redeemer, to.balanceOf(this));
        _redeemer.undo();
        from.approve(forum, from.balanceOf(this));
        from.approve(lottery, from.balanceOf(this));
    }
    function tryRedeemForumToken(Redeemer _redeemer) external {
        lottery.redeem(_redeemer);
    }
    function tryRedeemLotteryToken(Redeemer _redeemer) external {
        lottery.redeem(_redeemer);
    }
    function tryUndoForumToken(Redeemer _redeemer) external {
        lottery.undo(_redeemer);
    }
    function tryUndoLotteryToken(Redeemer _redeemer) external {
        lottery.undo(_redeemer);
    }
    function trySetForumOwner(address _owner) external {
        forum.setOwner(_owner);
    }
    function trySetLotteryOwner(address _owner) external {
        lottery.setOwner(_owner);
    }
}
contract AppTokenMock is AppToken {
    function AppTokenMock(uint256 balance, address admin1, address admin2, address admin3) AppToken(admin1, admin2, admin3) public {
        balances[msg.sender] = balance;
        Transfer(0x0, msg.sender, balance);
    }
}
contract LotteryTest is DSTest, ForumEvents {
    Voter admin1;
    Voter admin2;
    AppToken token;
    Forum forum;
    LotteryMock lottery;
    AppToken successorToken;
    Redeemer redeemer;
    function setUp() public {
        admin1 = new Voter(Lottery(0x0), Forum(0x0), AppToken(0x0));
        admin2 = new Voter(Lottery(0x0), Forum(0x0), AppToken(0x0));
        uint256 supply  = 1000000000 ether;
        token = new AppTokenMock(supply, msg.sender, admin1, admin2);
        admin1.setToken(token);
        admin2.setToken(token);
        forum = new Forum();
        admin1.setForum(forum);
        admin2.setForum(forum);
        lottery = new LotteryMock(token, forum);
        forum.setBeneficiary(lottery);
        successorToken = new AppTokenMock(supply, msg.sender, admin1, admin2);
        redeemer = new RedeemerMock(token, successorToken);
        successorToken.transfer(redeemer, supply);
    }
    modifier test {
        admin1.install(token, lottery);
        admin2.install(token, lottery);
        admin1.install(successorToken, lottery);
        admin2.install(successorToken, lottery);
        require(token.installed(lottery));
        _;
    }
    function testFail_noInstallPost() public {
        forum.post(0x0,0x0);
    }
    function testFail_noInstallVote() public {
        lottery.upvote(0);
    }
    function test_reward() public test {
        lottery.setRewardPool(5000);
        assertEq(lottery.reward(0), 2000);
        assertEq(lottery.reward(1), 1250);
        assertEq(lottery.reward(2), 1000);
        assertEq(lottery.reward(3), 500);
        assertEq(lottery.reward(4), 250);

        assertEq(lottery.rewardPool(),
            lottery.reward(0)
            + lottery.reward(1)
            + lottery.reward(2)
            + lottery.reward(3)
            + lottery.reward(4)
        );
    }

    function testFail_earlyEpoch() public test {
        lottery.endEpoch();
    }
    function testFail_earlySecondEpoch() public test {
        nextEpoch();
        lottery.endEpoch();
    }

    function assertNoWinners() internal {
        assertEq(lottery.payouts(0), 0);
        assertEq(lottery.payouts(1), 0);
        assertEq(lottery.payouts(2), 0);
        assertEq(lottery.payouts(3), 0);
        assertEq(lottery.payouts(4), 0);
    }
    function nextEpoch() internal {
        lottery.warp(1 days);
        lottery.endEpoch();
    }

    function test_emptyEpoch() public test {
        nextEpoch();
        assertNoWinners();
        nextEpoch();
        assertNoWinners();
        
        forum.post(0x0, 0x0);
        lottery.upvote(1);
        nextEpoch();
        assertNoWinners();
    }

    function test_epoch() public test {
        forum.post(0x0, 0x0);
        forum.post(0x0, 0x0);

        nextEpoch();
        assertNoWinners();
        assertEq(lottery.epochPrior(), 0);
        assertEq(lottery.epochCurrent(), 3);

        forum.post(0x0, 0x0);
        lottery.upvote(2);
        lottery.upvote(1);
        lottery.upvote(3);
        nextEpoch();
        assertEq(lottery.payouts(0), this);
        assertEq(lottery.payouts(1), this);
        assertEq(lottery.payouts(2), 0);
        assertEq(lottery.payouts(3), 0);
        assertEq(lottery.payouts(4), 0);
        assertEq(lottery.epochCurrent(), lottery.epochPrior() + 1);
        uint256 balance = token.balanceOf(this);
        lottery.claim(0);
        lottery.claim(1);
        uint256 balanceAfter = token.balanceOf(this);
        assertEq(balance + lottery.reward(0) + lottery.reward(1), balanceAfter);

        lottery.downvote(3);
        nextEpoch();
        assertNoWinners();
    }

    function test_epochRanking() public test {
        // 1
        forum.post(0x0, 0x0);
        // 2
        forum.post(0x0, 0x0);

        Voter v1 = new Voter(lottery, forum, token);
        token.transfer(v1, 10 ether);
        // 3
        v1.post();

        Voter v2 = new Voter(lottery, forum, token);
        token.transfer(v2, 10 ether);
        // 4
        v2.post();

        nextEpoch();
        assertNoWinners();

        // 1: +1
        lottery.upvote(1);
        v1.upvote(1);
        v2.downvote(1);

        // 2: -1
        lottery.downvote(2);
        v1.upvote(2);
        v2.downvote(2);

        // 3: +3
        lottery.upvote(3);
        v1.upvote(3);
        v2.upvote(3);

        // 4: +2
        lottery.upvote(4);
        v2.upvote(4);

        nextEpoch();
        assertEq(lottery.payouts(0), v1);
        assertEq(lottery.payouts(1), v2);
        assertEq(lottery.payouts(2), this);
        assertEq(lottery.payouts(3), 0x0);

        v1.claim(0);
        v2.claim(1);
        lottery.claim(2);
    }

    function test_upvoteDownvote() public test {
        Voter v1 = new Voter(lottery, forum, token);
        token.transfer(v1, 10 ether);
        Voter v2 = new Voter(lottery, forum, token);
        token.transfer(v2, 10 ether);

        lottery.upvote(1);
        assertEq(lottery.votes(1), 1);
        v1.upvote(1);
        assertEq(lottery.votes(1), 2);
        v1.postAndUpvote();
        v2.upvote(1);
        assertEq(lottery.votes(1), 3);
        lottery.downvote(1);
        assertEq(lottery.votes(1), 1);
        v1.downvote(1);
        assertEq(lottery.votes(1), -1);
        v2.downvote(1);
        assertEq(lottery.votes(1), -3);

        v2.downvote(2);
        assertEq(lottery.votes(2), -1);
        v2.downvote(2);
        assertEq(lottery.votes(2), -1);
        v1.downvote(2);
        assertEq(lottery.votes(2), -2);
        lottery.downvote(2);
        assertEq(lottery.votes(2), -3);
        v1.postAndUpvote();
        assertEq(lottery.votes(2), -1);

        assertEq(lottery.votes(3), 0);
        v2.unvote(3);
        assertEq(lottery.votes(3), 0);
        v1.upvote(3);
        assertEq(lottery.votes(3), 1);
        v2.upvote(3);
        assertEq(lottery.votes(3), 2);
        v2.downvote(3);
        assertEq(lottery.votes(3), 0);
        v2.postAndUpvote();
        assertEq(lottery.votes(3), 2);
        v2.unvote(3);
        assertEq(lottery.votes(3), 1);
    }

    function testFail_noTokens() public test {
        Voter v1 = new Voter(lottery, forum, token);
        v1.upvote(1);
    }

    function redeem() internal {
        lottery.redeem(redeemer);

        uint256 balanceBefore = token.balanceOf(this);
        token.approve(redeemer, balanceBefore);
        redeemer.redeem();
        assertEq(balanceBefore, successorToken.balanceOf(this));
    }

    function undo() internal {
        lottery.undo(redeemer);

        uint256 balanceBefore = successorToken.balanceOf(this);
        successorToken.approve(redeemer, balanceBefore);
        redeemer.undo();
        assertEq(token.balanceOf(this), balanceBefore);
    }

    function test_ownerUpgrade() public test {
        assertEq(forum.owner(), this);

        forum.post(0x0, 0x0);
        forum.postAndUpvote(0x0, 0x0);

        redeem();
        forum.post(0x0, 0x0);
        forum.postAndUpvote(0x0, 0x0);

        undo();
        forum.post(0x0, 0x0);
        forum.postAndUpvote(0x0, 0x0);
    }
    function testFail_forumUpgrade() public test {
        Voter v1 = new Voter(lottery, forum, token);
        v1.tryRedeemForumToken(redeemer);
    }
    function testFail_lotteryUpgrade() public test {
        Voter v1 = new Voter(lottery, forum, token);
        v1.tryRedeemLotteryToken(redeemer);
    }
    function testFail_forumDowngrade() public test {
        Voter v1 = new Voter(lottery, forum, token);
        v1.tryUndoForumToken(redeemer);
    }
    function testFail_lotteryDowngrade() public test {
        Voter v1 = new Voter(lottery, forum, token);
        v1.tryUndoLotteryToken(redeemer);
    }
    function testFail_lotterySetOwner() public test {
        Voter v1 = new Voter(lottery, forum, token);
        v1.trySetLotteryOwner(v1);
    }
    function testFail_forumSetOwner() public test {
        Voter v1 = new Voter(lottery, forum, token);
        v1.trySetForumOwner(v1);
    }
    function test_setOwner() public test {
        assertEq(forum.owner(), this);
        assertEq(lottery.owner(), this);

        Voter v1 = new Voter(lottery, forum, token);
        forum.setOwner(v1);
        lottery.setOwner(v1);
        v1.trySetForumOwner(this);
        v1.trySetLotteryOwner(this);
        forum.setOwner(v1);
        lottery.setOwner(v1);
        v1.trySetForumOwner(this);
        v1.trySetLotteryOwner(this);
    }
    function test_postEvents() public test {
        expectEventsExact(forum);
        Topic(0x0, 0x0);
        Topic(0x0, keccak256("Hello"));
        Topic(0x2, keccak256("World"));

        forum.post(0x0, 0x0);
        forum.post(0x0, keccak256("Hello"));
        forum.postAndUpvote(0x2, keccak256("World"));
    }
    function test_redeemerReward() public test {
        Voter v1 = new Voter(lottery, forum, token);
        token.transfer(v1, 10 ether);
        // 1
        v1.post();
        // 2
        forum.post(0x0, 0x0);
        v1.upvote(1);
        lottery.upvote(1);

        nextEpoch();
        redeem();
        assertNoWinners();
        v1.redeem(redeemer);
        v1.upvote(2);

        nextEpoch();
        assertEq(lottery.payouts(0), v1);
        assertEq(lottery.payouts(1), this);
        assertEq(lottery.payouts(2), 0x0);

        v1.claim(0);
        undo();
        lottery.claim(1);

        nextEpoch();
        assertNoWinners();
    }
    function test_sixPosts() public test {
        Voter v1 = new Voter(lottery, forum, token);
        token.transfer(v1, 10 ether);
        Voter v2 = new Voter(lottery, forum, token);
        token.transfer(v2, 10 ether);
        Voter v3 = new Voter(lottery, forum, token);
        token.transfer(v3, 10 ether);

        // 1 : 4
        v1.postAndUpvote();
        lottery.upvote(1);
        v2.upvote(1);
        v3.upvote(1);
        // 2 : 3
        v2.postAndUpvote();
        lottery.upvote(2);
        v3.upvote(2);
        // 3 : 1
        v3.postAndUpvote();
        lottery.downvote(3);
        v2.upvote(3);
        // 4 : 2
        forum.postAndUpvote(0x0, 0x0);
        v1.upvote(4);
        // 5 : 1
        forum.post(0x0, 0x0);
        lottery.upvote(5);
        // 6 : 3
        v3.postAndUpvote();
        v1.upvote(6);
        lottery.upvote(6);

        nextEpoch();
        assertNoWinners();

        nextEpoch();
        assertEq(lottery.payouts(0), v1);
        assertEq(lottery.payouts(1), v3);
        assertEq(lottery.payouts(2), v2);
        assertEq(lottery.payouts(3), this);
        assertEq(lottery.payouts(4), this);
        v1.claim(0);
        v3.claim(1);
        v2.claim(2);
        lottery.claim(3);
        lottery.claim(4);

        nextEpoch();
        assertNoWinners();
        assertEq(lottery.rewardPool(), 0);
    }

    function test_sevenPosts() public test {
        Voter v1 = new Voter(lottery, forum, token);
        token.transfer(v1, 10 ether);
        Voter v2 = new Voter(lottery, forum, token);
        token.transfer(v2, 10 ether);
        Voter v3 = new Voter(lottery, forum, token);
        token.transfer(v3, 10 ether);

        // 1 : 2
        v1.postAndUpvote();
        lottery.downvote(1);
        v2.upvote(1);
        v3.upvote(1);
        // 2 : 3
        v2.postAndUpvote();
        lottery.upvote(2);
        v3.upvote(2);
        // 3 : 2
        v3.postAndUpvote();
        lottery.downvote(3);
        v2.upvote(3);
        v1.upvote(3);
        // 4 : 2
        forum.postAndUpvote(0x0, 0x0);
        v1.upvote(4);
        // 5 : 1
        forum.post(0x0, 0x0);
        lottery.upvote(5);
        // 6 : 0
        v2.postAndUpvote();
        lottery.downvote(6);
        // 7 : 2
        v3.postAndUpvote();
        v1.upvote(7);

        nextEpoch();
        assertNoWinners();

        nextEpoch();
        assertEq(lottery.payouts(0), v2);
        assertEq(lottery.payouts(1), v3);
        assertEq(lottery.payouts(2), this);
        assertEq(lottery.payouts(3), v3);
        assertEq(lottery.payouts(4), v1);
        v2.claim(0);
        v3.claim(1);
        lottery.claim(2);
        v3.claim(3);
        v1.claim(4);

        nextEpoch();
        assertNoWinners();
        assertEq(lottery.rewardPool(), 0);
    }
}
