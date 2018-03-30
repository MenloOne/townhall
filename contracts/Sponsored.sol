pragma solidity^0.4.19;
// like a less-liquid GasToken
contract Sponsored {
    uint256[] wastedSpace;
    function sponsor() external {
        uint256 len = wastedSpace.length;
        wastedSpace.length = len + 3;
        wastedSpace[len] = 1;
        wastedSpace[len + 1] = 1;
        wastedSpace[len + 2] = 1;
    }   
    modifier sponsored {
        _;  
        uint256 len = wastedSpace.length;
        if (len != 0) {
            wastedSpace[--len] = 0;
            wastedSpace[--len] = 0;
            wastedSpace[--len] = 0;
            wastedSpace.length = len;
        }   
    }   
}
