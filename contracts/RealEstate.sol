// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage {
    // Use Counters library for token IDs
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Constructor with contract name and symbol
    constructor() ERC721("Real Estate", "REAL") {}

    // Mint a new token with its URI
    function mint(string memory tokenURI) public returns (uint256) {
        // Increment token counter and get ID
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Mint and set URI for the token
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    // View total number of minted tokens
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
