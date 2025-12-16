import Web3 from 'web3';

declare global {
    interface Window {
        ethereum?: any;
        web3?: any;
    }
}

let web3: Web3 | undefined;

if (typeof window !== 'undefined' && window.ethereum) {
    web3 = new Web3(window.ethereum);
} else if (typeof window !== 'undefined' && window.web3) {
    web3 = new Web3(window.web3.currentProvider);
} else {
    // Fallback? Or just leave undefined
    console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
}

export const loadWeb3 = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            return web3;
        } catch (error) {
            console.error("User denied account access");
            throw error;
        }
    }
    return web3;
};

export default web3;
