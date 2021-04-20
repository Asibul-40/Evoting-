// SPDX-License-Identifier: MIT

//This is just a smart contract that will handle our Smart Cntract to deploy in blockchain 

pragma solidity ^0.5.0;

contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration;

  modifier restricted() {
    require(
      msg.sender == owner,
      "This function is restricted to the contract's owner"
    );
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }

  // function upgrade(address new_address) restricted{
  //   Migrations upgraded = Migrations(new_address);
  //   upgraded.setCompleted(last_completed_migration);
  // }

}
