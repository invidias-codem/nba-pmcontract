// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NBACard.sol";

import "../src/mocks/MockCTF.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy MockCTF for local testing
        MockCTF mockCtf = new MockCTF();
        console.log("MockCTF deployed at:", address(mockCtf));

        address ctfAddress = address(mockCtf); 
        string memory baseUri = "https://api.yourdomain.com/metadata/";

        NBACard nbaCard = new NBACard(ctfAddress, baseUri);
        console.log("NBACard deployed at:", address(nbaCard));

        // Setup for verification: Mint CTF to deployer and approve NBACard
        mockCtf.mint(deployer, 1, 100); // Mint Token ID 1, Amount 100
        mockCtf.mint(deployer, 123, 100); // Mint Token ID 123, Amount 100
        mockCtf.setApprovalForAll(address(nbaCard), true);
        console.log("Minted MockCTF and approved NBACard");

        vm.stopBroadcast();
    }
}
