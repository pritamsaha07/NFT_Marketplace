// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    uint256 private tokenIdCounter;
    
    struct NftInfo {
        string url;
        uint256 price;
        bool isForSale;
    }

    NftInfo[] public nftArray;

    mapping(uint256 => NftInfo) private nftInfos;

    constructor() ERC721("Pritam007", "PS007") {
        tokenIdCounter = 1;
    }

    function mintNFT(string memory tokenURI) public {
        uint256 newItemId = tokenIdCounter;
        _mint(msg.sender, newItemId);
        tokenIdCounter++;
    }

    function listNFTForSale(string memory tokenURI, uint256 price) public {
        uint256 tokenId = tokenIdCounter;
        nftInfos[tokenId] = NftInfo({url: tokenURI, price: price, isForSale: true });
        nftArray.push(nftInfos[tokenId]);
        tokenIdCounter++;
    }

    function showNfts() public view returns (NftInfo[] memory) {
        return nftArray;
    }

    function buyNFT(uint256 tokenId) public payable {
       
        NftInfo storage nft = nftInfos[tokenId];

        require(nft.isForSale, "NFT is not for sale");
        require(msg.value >= nft.price, "Insufficient funds");

        address previousOwner = ownerOf(tokenId);
        nft.isForSale = false;

        _transfer(previousOwner, msg.sender, tokenId);
        payable(previousOwner).transfer(msg.value);
    }
}