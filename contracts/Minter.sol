// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract Minter is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public mintValue;
    mapping(string => uint8) public existingURIs;

    constructor() ERC721("Minter", "MIN") {
        mintValue = 0.05 ether;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmXhfZ3BcBdfwT7tPxxHScYG5ZzDbq36NUdjKFYm6wTEZJ";
    }

    function _mintNFT(address to, string memory uri) internal returns(uint256) {
        require(existingURIs[uri] != 1, "NFT already minted!");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[uri] = 1;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        console.log("tokenId", tokenId);
        console.log("uri", uri);

        return tokenId;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        _mintNFT(to, uri);
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

    // The following functions are custom made.

    function setMintValue(uint256 _mintValue) public onlyOwner {
        mintValue = _mintValue;
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function payToMint(address to, string memory uri) public payable returns (uint256) {
        require(msg.value >= mintValue, "Need to pay up");

        return _mintNFT(to, uri);
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function withdraw() external onlyOwner {
        payable(address(this)).transfer(address(this).balance);
    }
}
