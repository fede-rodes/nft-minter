// Contract based on [https://docs.openzeppelin.com/contracts/4.x/wizard](https://docs.openzeppelin.com/contracts/4.x/wizard)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Minter is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  uint256 public constant MAX_SUPPLY = 5000;

  mapping(string => bool) public mintedURIs;
  mapping(address => bool) public minterAddresses;

  constructor() ERC721("CryptoChangos", "CC") {} // TODO

  // function _baseURI() internal pure override returns (string memory) {
  //   return "";
  // }

  // Anybody can mint 1 token for free and 1 token only.
  // Owner has unlimited mints.
  function mintNFT(string memory uri) public returns(uint256) {
    address sender = msg.sender;

    require(mintedURIs[uri] == false, "Minter: NFT already minted!");
    if (sender != owner()) {
      require(minterAddresses[sender] == false, "Minter: address already used!");
    }

    mintedURIs[uri] = true;
    minterAddresses[sender] = true;

    _tokenIdCounter.increment();
    uint256 tokenId = _tokenIdCounter.current();

    // TODO: implement MAX_SUPPLY check

    _safeMint(sender, tokenId);
    _setTokenURI(tokenId, uri);

    return tokenId;
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

  // The following are custom functions.

  function count() public view returns (uint256) {
    return _tokenIdCounter.current();
  }

  function tokensOfOwner(address addr) public view returns(uint256[] memory) {
    uint256 balance = balanceOf(addr);
    uint256[] memory tokenIds = new uint256[](balance);

    for(uint256 i; i < balance; i++){
        tokenIds[i] = tokenOfOwnerByIndex(addr, i);
    }

    return tokenIds;
  }
}
