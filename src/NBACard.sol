// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./interfaces/ICTF.sol";

contract NBACard is ERC1155, Ownable, ERC1155Holder {
    ICTF public ctf;
    string private _baseUri;

    constructor(address _ctf, string memory baseUri_) ERC1155(baseUri_) Ownable(msg.sender) {
        ctf = ICTF(_ctf);
        _baseUri = baseUri_;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
        _baseUri = newuri;
    }

    function setCTF(address _ctf) public onlyOwner {
        ctf = ICTF(_ctf);
    }

    function wrap(uint256 ctfId, uint256 amount) external {
        // Transfer CTF from user to this contract
        ctf.safeTransferFrom(msg.sender, address(this), ctfId, amount, "");
        
        // Mint NBACard to user with same ID
        _mint(msg.sender, ctfId, amount, "");
    }

    function redeem(uint256 tokenId, uint256 amount) external {
        // Burn NBACard
        _burn(msg.sender, tokenId, amount);
        
        // Transfer CTF back to user
        ctf.safeTransferFrom(address(this), msg.sender, tokenId, amount, "");
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseUri, toString(tokenId)));
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
