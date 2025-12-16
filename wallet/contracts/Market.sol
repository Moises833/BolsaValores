// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Market {
    IERC20 public stockToken;
    IERC20 public fiatToken; // The "Fake Money" token
    uint256 public rate = 100; // 1 Fiat = 100 Stock

    event TokensPurchased(
        address indexed buyer,
        uint256 amountOfFiat,
        uint256 amountOfStock
    );
    event TokensSold(
        address indexed seller,
        uint256 amountOfStock,
        uint256 amountOfFiat
    );

    constructor(address _stockToken, address _fiatToken) {
        stockToken = IERC20(_stockToken);
        fiatToken = IERC20(_fiatToken);
    }

    // Buy Stock with Fiat
    function buyTokens(uint256 _fiatAmount) public {
        // Calculate stock amount: if rate is 100, 1 Fiat = 100 Stocks
        // But tokens use 18 decimals, so math is simple direct multiplication if decimals match
        uint256 stockAmount = _fiatAmount * rate;

        require(
            stockToken.balanceOf(address(this)) >= stockAmount,
            "Not enough stocks in market"
        );

        // Transfer Fiat from User -> Market
        require(
            fiatToken.transferFrom(msg.sender, address(this), _fiatAmount),
            "Fiat transfer failed"
        );

        // Transfer Stock from Market -> User
        require(
            stockToken.transfer(msg.sender, stockAmount),
            "Stock transfer failed"
        );

        emit TokensPurchased(msg.sender, _fiatAmount, stockAmount);
    }

    // Sell Stock for Fiat
    function sellTokens(uint256 _stockAmount) public {
        require(
            stockToken.balanceOf(address(this)) >= _stockAmount,
            "Sanity check failed"
        ); // Not strictly needed but good for checking approvals? No.

        uint256 fiatAmount = _stockAmount / rate;

        require(
            fiatToken.balanceOf(address(this)) >= fiatAmount,
            "Not enough liquidity (fiat) in market"
        );

        // Transfer Stock from User -> Market
        require(
            stockToken.transferFrom(msg.sender, address(this), _stockAmount),
            "Stock transfer failed"
        );

        // Transfer Fiat from Market -> User
        require(
            fiatToken.transfer(msg.sender, fiatAmount),
            "Fiat transfer failed"
        );

        emit TokensSold(msg.sender, _stockAmount, fiatAmount);
    }
}
