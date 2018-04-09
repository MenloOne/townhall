/*
  Copyright 2018 Vulcanize, Inc.

  Licensed under the Apache License, Version 2.0 (the “License”);
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an “AS IS” BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
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
