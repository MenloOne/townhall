pragma solidity^0.4.19;

import "./AppToken.sol";
import "./forum.sol";
import "./redeemer.sol";

contract Lottery is Beneficiary, Sponsored {
    // though ERC20 says tokens *should* revert in transferFrom without allowance
    // this token *must* revert
    AppToken public token;
    Forum public forum;
    address public owner;
    uint256 public epochTimestamp;
    uint256 public epochPrior;
    uint256 public epochCurrent;
    mapping (uint256 => int256) public votes;
    mapping (uint256 => mapping (address => int8)) voters;
    address[] public posters;

    uint256 public postCost;
    uint256 public nextPostCost;

    function postCount() public view returns (uint256) {
        return posters.length;
    }

    uint256 public rewardPool;
    address[5] public payouts;

    function Lottery(AppToken _token, Forum _forum) public {
        token = _token;
        forum = _forum;
        owner = msg.sender;
        posters.push(0); // no author for root post 0
        postCost = 20 finney;
        nextPostCost = 20 finney;
    }

    modifier vote(address _voter, uint256 _offset, int8 _direction) {
        int8 priorVote = voters[_offset][_voter];
        votes[_offset] += _direction - priorVote;
        voters[_offset][_voter] = _direction;
        _;
    }
    modifier transfersToken(address _voter) {
        token.appTransfer(_voter, this, postCost);
        _;
    }
    function upvote(uint256 _offset) external sponsored vote(msg.sender, _offset, 1) transfersToken(msg.sender) {
    }
    function downvote(uint256 _offset) external sponsored vote(msg.sender, _offset, -1) transfersToken(msg.sender) {
    }
    function unvote(uint256 _offset) external vote(msg.sender, _offset, 0) transfersToken(msg.sender) {
    }
    function endEpoch() external {
        require(era() >= epochTimestamp + 1 days);
        epochTimestamp = era();

        uint256[5] memory winners; 
        int256[5] memory topVotes;
        // get top 5 posts
        for (uint256 i = epochCurrent; i --> epochPrior;) {
            if (votes[i] == 0) {
                continue;
            }

            int256 current = votes[i];
            if (current > topVotes[4]) {
                // insert it

                /*
                uint8 j = 4;
                while (topVotes[j-1] < current) {
                    topVotes[j] = topVotes[j-1];
                    winners[j] = winners[j-1];
                    j--;
                    if (j == 0) {
                        break;
                    }
                }
                topVotes[j] = current;
                winners[j] = i;
                */
                // the code below is equivalent to the commented code above
                if (current > topVotes[2]) {
                    topVotes[4] = topVotes[3];
                    topVotes[3] = topVotes[2];
                    winners[4] = winners[3];
                    winners[3] = winners[2];
                    if (current > topVotes[1]) {
                        topVotes[2] = topVotes[1];
                        winners[2] = winners[1];
                        if (current > topVotes[0]) {
                            topVotes[1] = topVotes[0];
                            topVotes[0] = current;
                            winners[1] = winners[0];
                            winners[0] = i;
                        } else {
                            topVotes[1] = current;
                            winners[1] = i;
                        }
                    } else {
                        topVotes[2] = current;
                        winners[2] = i;
                    }
                } else {
                    if (current > topVotes[3]) {
                        topVotes[4] = topVotes[3];
                        topVotes[3] = current;
                        winners[4] = winners[3];
                        winners[3] = i;
                    } else {
                        topVotes[4] = current;
                        winners[4] = i;
                    }
                }
            }
            votes[i] = 0;
        }

        // write the new winners
        for (i = 0; i < 5; i++) {
            payouts[i] = posters[winners[i]];
        }
        // refresh the pool
        rewardPool = token.balanceOf(this);
        epochPrior = epochCurrent;
        epochCurrent = posters.length;
        if (nextPostCost != postCost) {
            postCost = nextPostCost;
        }
    }
    function reward(uint8 _payout) public view returns (uint256) {
        // I wish we had switch()
        if (_payout == 0) {
            return rewardPool * 2 / 5;
        } else if (_payout == 1) {
            return rewardPool / 4;
        } else if (_payout == 2) {
            return rewardPool / 5;
        } else if (_payout == 3) {
            return rewardPool / 10;
        } else if (_payout == 4) {
            return rewardPool / 20;
        }
        return 0;
    }
    function claim(uint8 _payout) external {
        require(payouts[_payout] == msg.sender);
        payouts[_payout] = 0;
        token.transfer(msg.sender, reward(_payout));
    }
    modifier onlyOwner {
        require (msg.sender == owner);
        _;
    }
    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }
    function setNextPostCost(uint256 _nextPostCost) external onlyOwner {
        nextPostCost = _nextPostCost;
    }
    function redeem(Redeemer _redeemer) external onlyOwner returns (AppToken) {
        require(_redeemer.from() == token);

        token.approve(_redeemer, token.balanceOf(this));
        _redeemer.redeem();
        AppToken to = _redeemer.to();
        token = to;
        return to;
    }
    function undo(Redeemer _redeemer) external onlyOwner returns (AppToken) {
        require(_redeemer.to() == token);

        token.approve(_redeemer, token.balanceOf(this));
        _redeemer.undo();
        AppToken from = _redeemer.from();
        token = from;
        return from;
    }
    function era() internal view returns (uint256) {
        return now;
    }
    modifier pushPoster(address _poster) {
        posters.push(_poster);
        _;
    }
    modifier onlyForum {
        require(msg.sender == address(forum));
        _;
    }
    function onPostUpvote(address _poster) sponsored external onlyForum vote(_poster, posters.length, 1) transfersToken(_poster) pushPoster(_poster) {}
    function onPost(address _poster) external onlyForum transfersToken(_poster) pushPoster(_poster) {}
}
