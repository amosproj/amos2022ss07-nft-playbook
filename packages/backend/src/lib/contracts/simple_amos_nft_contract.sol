// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../../../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract simple_amos_nft_contract is ERC721 {
  uint256 public token_counter;
  struct Collectible {
    string pic_uri;
    string pic_hash;
  }
  mapping (uint256 => Collectible) public collectibles;

  event MintedEvent(uint256 token_counter);

  constructor(string memory name) ERC721(name, "sym") {
    token_counter = 0;
  }

  function mint(address pub_key_receiver, string memory pic_uri, string memory pic_hash) public returns (uint256) {
      token_counter += 1;
      collectibles[token_counter] = Collectible(pic_uri, pic_hash);
      _mint(pub_key_receiver, token_counter);
      emit MintedEvent(token_counter);
      return token_counter;
  }

  function read_pic_uri(uint256 token_counter_) public view returns (string memory ) {
    return collectibles[token_counter_].pic_uri;
  }

  function read_pic_hash(uint256 token_counter_) public view returns (string memory) {
    return collectibles[token_counter_].pic_hash;
  }

}
