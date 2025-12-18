const StockToken = artifacts.require("StockToken");
const FiatToken = artifacts.require("FiatToken");
const Market = artifacts.require("Market");

module.exports = async function (deployer, network, accounts) {
    const deployerAccount = accounts[0];

    // 1. Deploy StockToken with 1 million tokens (initial supply is in units, multiplied by 10^18 in constructor)
    await deployer.deploy(StockToken, 1000000);
    const stockToken = await StockToken.deployed();
    console.log("StockToken deployed at:", stockToken.address);

    // 2. Deploy FiatToken (Digital Dollar) with 1 million tokens
    await deployer.deploy(FiatToken, 1000000);
    const fiatToken = await FiatToken.deployed();
    console.log("FiatToken deployed at:", fiatToken.address);

    // 3. Deploy Market using the addresses of both tokens
    await deployer.deploy(Market, stockToken.address, fiatToken.address);
    const market = await Market.deployed();
    console.log("Market deployed at:", market.address);

    // 4. Setup Funding
    console.log("Funding Market...");

    // Transfer 800,000 TSTK to Market (using 18 decimals)
    const stockAmount = web3.utils.toWei("800000", "ether");
    await stockToken.transfer(market.address, stockAmount, { from: deployerAccount });

    // Transfer 700,000 USDX to Market (leaving 300,000 for the user)
    const fiatAmount = web3.utils.toWei("700000", "ether");
    await fiatToken.transfer(market.address, fiatAmount, { from: deployerAccount });

    console.log("Deployment and funding complete. User has 300,000 USDX and 200,000 TSTK.");
};
