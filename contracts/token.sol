pragma solidity ^0.4.19;

import "ds-token/token.sol";

contract Token is DSTokenBase {
    uint8 public decimals = 18;
    string public symbol = "TK";
    function Token(uint supply) DSTokenBase(supply) public {
    }
}
