// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CardNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum CardRarity {
        Basic,   // 基础卡片
        Advanced,// 高级卡片
        Rare     // 稀有卡片
    }

    enum OreType {
        Wisdom,
        Will,
        Creation,
        Connection
    }

    struct Card {
        uint256 cardId;
        CardRarity rarity;
        OreType oreType;
        uint256[] sourceOreIds;
        uint256 createdAt;
    }

    mapping(uint256 => Card) public cards;
    address public forgeEngine;

    event CardForged(
        uint256 indexed cardId,
        CardRarity rarity,
        OreType oreType
    );

    constructor() ERC721("Growth Card", "CARD") Ownable(msg.sender) {}

    function setForgeEngine(address _engine) external onlyOwner {
        forgeEngine = _engine;
    }

    function forgeCard(
        address to,
        CardRarity rarity,
        OreType oreType,
        uint256[] calldata sourceOreIds
    ) external returns (uint256) {
        require(msg.sender == forgeEngine || msg.sender == owner(), "Not authorized");
        require(sourceOreIds.length > 0, "No source ores");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);

        cards[newTokenId] = Card({
            cardId: newTokenId,
            rarity: rarity,
            oreType: oreType,
            sourceOreIds: sourceOreIds,
            createdAt: block.timestamp
        });

        emit CardForged(newTokenId, rarity, oreType);
        return newTokenId;
    }

    function getCard(uint256 tokenId) external view returns (Card memory) {
        require(_exists(tokenId), "Card does not exist");
        return cards[tokenId];
    }

    function getCardsByOwner(address owner_) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner_);
        uint256[] memory tokenIds = new uint256[](balance);
        uint256 index = 0;

        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (ownerOf(i) == owner_) {
                tokenIds[index] = i;
                index++;
            }
        }
        return tokenIds;
    }

    // Override required by Solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
