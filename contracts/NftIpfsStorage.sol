pragma solidity ^0.8.4;


contract NftIpfsStorage {
  string ipfsHash;

  function set(string memory datahash) public {
    ipfsHash = datahash;
  }

  function get() public view returns (string memory) {
    return ipfsHash;
  }
}