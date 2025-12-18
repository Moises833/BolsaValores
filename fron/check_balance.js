import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const web3 = new Web3('http://127.0.0.1:7545');

const checkBalance = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];
        console.log('Checking balance for account:', userAccount);

        // Load config
        const configPath = path.join(__dirname, 'src/config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

        // Create contract instances
        const fiatToken = new web3.eth.Contract(config.fiatAbi, config.fiatAddress);
        const stockToken = new web3.eth.Contract(config.tokenAbi, config.tokenAddress);

        // Get balances
        const fiatBalance = await fiatToken.methods.balanceOf(userAccount).call();
        const stockBalance = await stockToken.methods.balanceOf(userAccount).call();

        console.log('\n=== Your Balances ===');
        console.log('USDX (Fiat):', web3.utils.fromWei(fiatBalance, 'ether'));
        console.log('TSTK (Stock):', web3.utils.fromWei(stockBalance, 'ether'));
        console.log('====================\n');

    } catch (error) {
        console.error('Error checking balance:', error);
    }
};

checkBalance();
