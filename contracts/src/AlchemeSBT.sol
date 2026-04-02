// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AlchemeSBT - Soul Bound Token for Alcheme
 * @notice ERC-4906 Dynamic SBT that cannot be transferred
 */
contract AlchemeSBT is ERC721URIStorage, ERC721Enumerable, Ownable {
    uint256 private _tokenIdCounter;

    struct MedalData {
        string title;
        string description;
        uint256 createdAt;
        address creator;
    }

    mapping(uint256 => MedalData) public medals;

    event MedalMinted(address indexed creator, uint256 indexed tokenId, string title);
    event MedalEvolved(address indexed creator, uint256 indexed tokenId, string newTitle);

    constructor() ERC721("Alcheme Medal", "ALCHEME") Ownable(msg.sender) {}

    function mint(
        address to,
        string calldata uri,
        string calldata title,
        string calldata description
    ) external onlyOwner returns (uint256 tokenId) {
        tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        medals[tokenId] = MedalData({
            title: title,
            description: description,
            createdAt: block.timestamp,
            creator: to
        });

        emit MedalMinted(to, tokenId, title);
    }

    function evolve(
        uint256 tokenId,
        string calldata newUri,
        string calldata newTitle,
        string calldata newDescription
    ) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        // Update token URI (emits MetadataUpdate event from IERC4906)
        _setTokenURI(tokenId, newUri);
        
        // Update medal data
        medals[tokenId].title = newTitle;
        medals[tokenId].description = newDescription;

        emit MedalEvolved(msg.sender, tokenId, newTitle);
    }

    function getMedalData(uint256 tokenId) external view returns (MedalData memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return medals[tokenId];
    }

    function getTokensByOwner(address owner_) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner_);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter && index < balance; i++) {
            try this.ownerOf(i) returns (address tokenOwner) {
                if (tokenOwner == owner_) {
                    tokens[index] = i;
                    index++;
                }
            } catch {
                // Token doesn't exist or was burned
            }
        }
        
        return tokens;
    }

    // Prevent transfers (Soul Bound Token)
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        address from = ownerOf(tokenId);
        
        // Allow minting (from = address(0)) and burning (to = address(0))
        require(from == address(0) || to == address(0), "Soul Bound Token cannot be transferred");
        
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
