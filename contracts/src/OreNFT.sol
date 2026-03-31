// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OreNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum OreType {
        Wisdom,    // 智慧矿石 - 学习类
        Will,      // 意志矿石 - 健身/习惯类
        Creation,  // 创造矿石 - 创作类
        Connection // 连接矿石 - 社交类
    }

    struct Ore {
        uint256 goalId;
        OreType oreType;
        uint8 quality;      // 1-5星品质
        string contentHash; // IPFS hash
        uint256 timestamp;
        uint256 streak;     // 连续天数
    }

    mapping(uint256 => Ore) public ores;
    address public forgeEngine;

    event OreMinted(
        uint256 indexed tokenId,
        uint256 indexed goalId,
        OreType oreType,
        uint8 quality,
        uint256 streak
    );

    constructor() ERC721("Growth Ore", "ORE") Ownable(msg.sender) {}

    function setForgeEngine(address _engine) external onlyOwner {
        forgeEngine = _engine;
    }

    function mintOre(
        address to,
        uint256 goalId,
        OreType oreType,
        uint8 quality,
        string calldata contentHash,
        uint256 streak
    ) external returns (uint256) {
        require(msg.sender == forgeEngine || msg.sender == owner(), "Not authorized");
        require(quality >= 1 && quality <= 5, "Invalid quality");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(to, newTokenId);

        ores[newTokenId] = Ore({
            goalId: goalId,
            oreType: oreType,
            quality: quality,
            contentHash: contentHash,
            timestamp: block.timestamp,
            streak: streak
        });

        emit OreMinted(newTokenId, goalId, oreType, quality, streak);
        return newTokenId;
    }

    function getOre(uint256 tokenId) external view returns (Ore memory) {
        require(_exists(tokenId), "Ore does not exist");
        return ores[tokenId];
    }

    function getOresByOwner(address owner_) external view returns (uint256[] memory) {
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
