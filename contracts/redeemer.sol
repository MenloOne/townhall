pragma solidity^0.4.19;

import "erc20/erc20.sol";
interface Redeemer {
    function redeem() external;
    function undo() external;
    function to() external view returns (ERC20);
    function from() external view returns (ERC20);
}
