const StockToken = artifacts.require("StockToken");
const Market = artifacts.require("Market");

module.exports = async function (deployer) {
    // Deploy StockToken with 1 million tokens
    await deployer.deploy(StockToken, 1000000);
    const token = await StockToken.deployed();

    // Deploy Market
    await deployer.deploy(Market, token.address);
    const market = await Market.deployed();

    // Transfer all tokens to Market so it can sell them
    await token.transfer(market.address, "1000000000000000000000000"); // 1 million * 10^18
};
