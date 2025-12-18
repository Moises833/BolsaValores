
// deploy.js
import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Ganache
const web3 = new Web3('http://127.0.0.1:7545');

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const deployer = accounts[0];
        console.log('Deploying from:', deployer);

        // Helper to load artifact
        const loadArtifact = (name) => {
            // Path to wallet/build/contracts
            const p = path.resolve(__dirname, '../wallet/build/contracts', `${name}.json`);
            if (!fs.existsSync(p)) {
                throw new Error(`Artifact ${name}.json not found.Did you run 'truffle compile' in wallet / directory ? `);
            }
            return JSON.parse(fs.readFileSync(p, 'utf8'));
        };

        const StockTokenArtifact = loadArtifact('StockToken');
        const FiatTokenArtifact = loadArtifact('FiatToken');
        const MarketArtifact = loadArtifact('Market');

        // 1. Deploy StockToken
        console.log('Deploying StockToken...');
        const stockToken = new web3.eth.Contract(StockTokenArtifact.abi);
        const stockTokenDeploy = stockToken.deploy({
            data: StockTokenArtifact.bytecode,
            arguments: [1000000] // 1M stocks
        });
        const stockTokenInstance = await stockTokenDeploy.send({ from: deployer, gas: '3000000' });
        console.log('StockToken deployed at:', stockTokenInstance.options.address);

        // 2. Deploy FiatToken (Digital Dollar)
        console.log('Deploying FiatToken...');
        const fiatToken = new web3.eth.Contract(FiatTokenArtifact.abi);
        const fiatTokenDeploy = fiatToken.deploy({
            data: FiatTokenArtifact.bytecode,
            arguments: [1000000] // 1M Dollars
        });
        const fiatTokenInstance = await fiatTokenDeploy.send({ from: deployer, gas: '3000000' });
        console.log('FiatToken deployed at:', fiatTokenInstance.options.address);

        // 3. Deploy Market
        console.log('Deploying Market...');
        const market = new web3.eth.Contract(MarketArtifact.abi);
        const marketDeploy = market.deploy({
            data: MarketArtifact.bytecode,
            arguments: [stockTokenInstance.options.address, fiatTokenInstance.options.address]
        });
        const marketInstance = await marketDeploy.send({ from: deployer, gas: '3000000' });
        console.log('Market deployed at:', marketInstance.options.address);

        // 4. Setup Funding
        console.log('Funding Market...');
        // Give Market 80% of Stocks
        await stockTokenInstance.methods.transfer(marketInstance.options.address, web3.utils.toWei('800000', 'ether')).send({ from: deployer });

        // Give Market 70% of Fiat liquidity (leaving 300,000 for the user)
        await fiatTokenInstance.methods.transfer(marketInstance.options.address, web3.utils.toWei('700000', 'ether')).send({ from: deployer });

        console.log('Setup complete: Funds distributed.');

        // Save Config
        const config = {
            tokenAddress: stockTokenInstance.options.address,
            tokenAbi: StockTokenArtifact.abi,
            fiatAddress: fiatTokenInstance.options.address,
            fiatAbi: FiatTokenArtifact.abi,
            marketAddress: marketInstance.options.address,
            marketAbi: MarketArtifact.abi
        };

        fs.writeFileSync(
            path.join(__dirname, 'src/config.json'),
            JSON.stringify(config, null, 2)
        );
        console.log('Config saved to src/config.json');

    } catch (error) {
        console.error('Deployment failed:', error);
    }
};

deploy();
