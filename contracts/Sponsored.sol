/*
  Copyright 2018 William Morriss

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
