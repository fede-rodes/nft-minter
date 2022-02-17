// Contract based on [https://docs.openzeppelin.com/contracts/4.x/wizard](https://docs.openzeppelin.com/contracts/4.x/wizard)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Minter is ERC721, ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  mapping(string => bool) public mintedURIs;

  constructor() ERC721("CryptoChangos", "CC") {}

  function _baseURI() internal pure override returns (string memory) {
    return ""; // TODO
  }

  function mintNFT(address to, string memory uri) public returns(uint256) {
    // require(mintedURIs[uri] == false, "Minter: NFT already minted!");
    require(mintedURIs[uri] == false, "Minter: NFT already minted!");
    mintedURIs[uri] = true;
    _tokenIdCounter.increment();
    uint256 tokenId = _tokenIdCounter.current();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    return tokenId;
  }

  // The following functions are overrides required by Solidity.

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
}

// pragma solidity ^0.8.2;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

// contract CryptoChangos is ERC721, ERC721URIStorage, Ownable {
//     using Counters for Counters.Counter;

//     Counters.Counter private _tokenIdCounter;

//     // uint256 public mintValue; // TODO: no need
//     mapping(string => uint8) public existingURIs;

//     constructor() ERC721("CryptoChangos", "CC") {
//         // mintValue = 0.05 ether;
//     }

//     function _baseURI() internal pure override returns (string memory) {
//         return "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ";
//     }

//     function _mintNFT(address to) internal returns(uint256) {
//         _tokenIdCounter.increment();
//         uint256 tokenId = _tokenIdCounter.current();
//         string memory uri =  string(abi.encodePacked("/", Strings.toString(tokenId), ".png"));

//         require(existingURIs[uri] != 1, "NFT already minted!");

//         existingURIs[uri] = 1;
//         _safeMint(to, tokenId);
//         _setTokenURI(tokenId, uri);

//         return tokenId;
//     }

//     function safeMint(address to) public onlyOwner {
//         _mintNFT(to);
//     }

//     // The following functions are overrides required by Solidity.

//     function tokenURI(uint256 tokenId)
//         public
//         view
//         override(ERC721, ERC721URIStorage)
//         returns (string memory)
//     {
//         return super.tokenURI(tokenId);
//     }

//     // The following functions are custom made.

//     // function setMintValue(uint256 _mintValue) public onlyOwner {
//     //     mintValue = _mintValue;
//     // }

//     // function isContentOwned(string memory uri) public view returns (bool) {
//     //     return existingURIs[uri] == 1;
//     // }

//     function payToMint(address to) public payable returns (uint256) {
//         require(msg.value >= mintValue, "Need to pay up");

//         return _mintNFT(to);
//     }

//     // Instead of this, maybe try querying totalSupply.
//     // See: https://eips.ethereum.org/EIPS/eip-721 (ERC721Enumerable.totalSupply)
//     function count() public view returns (uint256) {
//         return _tokenIdCounter.current();
//     }

//     function withdraw() external onlyOwner {
//         payable(address(this)).transfer(address(this).balance);
//     }
// }
