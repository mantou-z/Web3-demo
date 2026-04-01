// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/OreNFT.sol";
import "../src/CardNFT.sol";
import "../src/MedalNFT.sol";
import "../src/GrowthForge.sol";

contract Deploy is Script {
    function run() external {
        vm.startBroadcast();

        // 部署 NFT 合约
        OreNFT oreNFT = new OreNFT();
        CardNFT cardNFT = new CardNFT();
        MedalNFT medalNFT = new MedalNFT();

        // 部署主合约
        GrowthForge forge = new GrowthForge(address(oreNFT), address(cardNFT));

        // 设置 forgeEngine 为 GrowthForge 地址
        oreNFT.setForgeEngine(address(forge));
        cardNFT.setForgeEngine(address(forge));
        medalNFT.setForgeEngine(address(forge));

        vm.stopBroadcast();

        // 输出合约地址
        console.log("OreNFT:", address(oreNFT));
        console.log("CardNFT:", address(cardNFT));
        console.log("MedalNFT:", address(medalNFT));
        console.log("GrowthForge:", address(forge));
    }
}
