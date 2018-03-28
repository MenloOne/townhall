pragma solidity^0.4.19;

import "./sponsored.sol";

interface Beneficiary {
    function onPost(address _poster) external;
    function onPostUpvote(address _poster) external;
}

contract ForumEvents {
    // the total ordering of all events on a smart contract is defined
    // a parent of 0x0 indicates root topic
    // by convention, the bytes32 is a keccak-256 content hash
    // the multihash prefix for this is 1b,20
    event Topic(bytes32 _parentHash, bytes32 contentHash);
}

contract Forum is ForumEvents {
    // receives all the post tokens
    Beneficiary public beneficiary;
    address public owner;

    function Forum() public {
        owner = msg.sender;
        Topic(0, 0);
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }

    function setBeneficiary(Beneficiary _beneficiary) external onlyOwner {
        beneficiary = _beneficiary;
    }

    function post(bytes32 _parentHash, bytes32 _contentHash) external {
        Topic(_parentHash, _contentHash);
        beneficiary.onPost(msg.sender);
    }

    function postAndUpvote(bytes32 _parentHash, bytes32 _contentHash) external {
        Topic(_parentHash, _contentHash);
        beneficiary.onPostUpvote(msg.sender);
    }
}
