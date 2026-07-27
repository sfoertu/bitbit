// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title MockERC20 — Test USDC (6 ondalık basamak)
contract MockERC20 is ERC20 {
    uint8 private immutable _dec;

    constructor(
        string memory name,
        string memory symbol,
        uint8 dec_
    ) ERC20(name, symbol) {
        _dec = dec_;
    }

    function decimals() public view override returns (uint8) {
        return _dec;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}
