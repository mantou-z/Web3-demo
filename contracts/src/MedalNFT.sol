// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MedalNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    enum MedalRank {
        Bronze, // 铜
        Silver, // 银
        Gold    // 金
    }

    struct Medal {
        uint256 medalId;
        uint256 goalId;
        string goalName;
        MedalRank rank;
        uint256[] sourceCardIds;
        uint256 createdAt;
    }

    mapping(uint256 => Medal) public medals;
    address public forgeEngine;

    event MedalForged(
        uint256 indexed medalId,
        uint256 indexed goalId,
        MedalRank rank
    );

    constructor() ERC721("Growth Medal", "MEDAL") Ownable(msg.sender) {}

    function setForgeEngine(address _engine) external onlyOwner {
        forgeEngine = _engine;
    }

    function forgeMedal(
        address to,
        uint256 goalId,
        string calldata goalName,
        MedalRank rank,
        uint256[] calldata sourceCardIds
    ) external returns (uint256) {
        require(msg.sender == forgeEngine || msg.sender == owner(), "Not authorized");
        require(sourceCardIds.length > 0, "No source cards");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(to, newTokenId);

        medals[newTokenId] = Medal({
            medalId: newTokenId,
            goalId: goalId,
            goalName: goalName,
            rank: rank,
            sourceCardIds: sourceCardIds,
            createdAt: block.timestamp
        });

        emit MedalForged(newTokenId, goalId, rank);
        return newTokenId;
    }

    function getMedal(uint256 tokenId) external view returns (Medal memory) {
        require(_ownerOf(tokenId) != address(0), "Medal does not exist");
        return medals[tokenId];
    }

    function getMedalsByOwner(address owner_) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner_);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;

        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (ownerOf(i) == owner_) {
                tokenIds[index] = i;
                index++;
            }
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
