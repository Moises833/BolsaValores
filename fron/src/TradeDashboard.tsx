import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import config from './config.json';
import CurrencyTable, { MOCK_CURRENCIES, type Currency } from './components/CurrencyTable';
import TransactionHistory from './components/TransactionHistory';

interface MarketProps {
    account: string;
}

const TradeDashboard: React.FC<MarketProps> = ({ account }) => {
    const [tokenBalance, setTokenBalance] = useState<string>('0');
    const [ethBalance, setEthBalance] = useState<string>('0');
    const [buyAmount, setBuyAmount] = useState<string>('');
    const [sellAmount, setSellAmount] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const [selectedCurrency, setSelectedCurrency] = useState<Currency>(MOCK_CURRENCIES[0]);
    const [activeTab, setActiveTab] = useState<'market' | 'history'>('market');
    const [marketBalance, setMarketBalance] = useState<string>('0');
    const [contractRate, setContractRate] = useState<number>(0);

    // Initialize Web3 and Contracts with useMemo to prevent re-instantiation on every render (Fixes MaxListenersExceededWarning)
    const { web3Instance, tokenContract, marketContract, fiatContract } = React.useMemo(() => {
        const w3 = new Web3(window.ethereum);
        const tc = new w3.eth.Contract(config.tokenAbi, config.tokenAddress);
        const mc = new w3.eth.Contract(config.marketAbi, config.marketAddress);
        const fc = new w3.eth.Contract(config.fiatAbi, config.fiatAddress);
        return { web3Instance: w3, tokenContract: tc, marketContract: mc, fiatContract: fc };
    }, []);

    const loadBalances = async () => {
        if (!account) return;
        try {
            const tb = await tokenContract.methods.balanceOf(account).call();
            // Load Fiat Balance instead of ETH
            const fb = await fiatContract.methods.balanceOf(account).call();
            setTokenBalance(web3Instance.utils.fromWei(tb as any, 'ether'));
            setEthBalance(web3Instance.utils.fromWei(fb as any, 'ether')); // Reusing ethBalance var for Fiat to minimize changes

            // Load Market Balance (Liquidity)
            const mb = await tokenContract.methods.balanceOf(config.marketAddress).call();
            setMarketBalance(web3Instance.utils.fromWei(mb as any, 'ether'));

            // Load Contract Rate
            const r = await marketContract.methods.rate().call();
            setContractRate(Number(r));
        } catch (e) {
            console.error("Error loading balances:", e);
        }
    };

    useEffect(() => {
        loadBalances();
        const interval = setInterval(loadBalances, 5000);
        return () => clearInterval(interval);
    }, [account, web3Instance]);

    const handleBuy = async () => {
        if (!buyAmount) return;

        if (selectedCurrency.id !== 'tstk') {
            setStatus(`Simulación: Comprando ${selectedCurrency.name}...`);
            setTimeout(() => setStatus('¡Compra Simulada Exitosa!'), 1500);
            return;
        }

        setLoading(true);
        setStatus('Aprobando Dólares...');
        try {
            const amountWei = web3Instance.utils.toWei(buyAmount, 'ether');
            const amountNum = parseFloat(buyAmount);

            // Check User Fiat Balance
            if (amountNum > parseFloat(ethBalance)) {
                setStatus('Error: Fondos insuficientes de USDX.');
                setLoading(false);
                return;
            }

            // Check Market Liquidity
            if (contractRate > 0) {
                const expectedTokens = amountNum * contractRate;
                if (expectedTokens > parseFloat(marketBalance)) {
                    setStatus(`Error: El Mercado no tiene suficiente liquidez. Disponible: ${marketBalance} TSTK`);
                    setLoading(false);
                    return;
                }
            }

            // 1. Approve Market to spend Fiat
            await fiatContract.methods.approve(config.marketAddress, amountWei).send({ from: account });

            setStatus('Procesando compra...');
            // 2. Buy (send 0 ETH, but logic inside contract takes Fiat)
            await marketContract.methods.buyTokens(amountWei).send({
                from: account
            });

            setStatus('¡Compra Exitosa!');
            setBuyAmount('');
            loadBalances();
        } catch (err: any) {
            console.error(err);
            if (err.code === 4001 || (err.message && err.message.includes("User denied"))) {
                setStatus('Transacción rechazada por el usuario.');
            } else {
                setStatus('Error: ' + err.message);
            }
        }
        setLoading(false);
    };

    const handleSell = async () => {
        if (!sellAmount) return;
        setLoading(true);
        setStatus('Aprobando Acciones...');
        try {
            const amountWei = web3Instance.utils.toWei(sellAmount, 'ether');
            // Approve first
            await tokenContract.methods.approve(config.marketAddress, amountWei).send({
                from: account
            });
            setStatus('Procesando venta...');
            await marketContract.methods.sellTokens(amountWei).send({
                from: account
            });
            setStatus('¡Venta Exitosa!');
            setSellAmount('');
            loadBalances();
        } catch (err: any) {
            console.error(err);
            if (err.code === 4001 || (err.message && err.message.includes("User denied"))) {
                setStatus('Transacción rechazada por el usuario.');
            } else {
                setStatus('Error: ' + err.message);
            }
        }
        setLoading(false);
    };

    return (
        <div className="dashboard-content">
            <div className="stats-grid">
                <div className="stat-card gradient-1">
                    <h3>Tu Balance (USDX)</h3>
                    <p className="balance">${parseFloat(ethBalance).toFixed(2)}</p>
                </div>
                <div className="stat-card gradient-2">
                    <h3>Tus Acciones ({selectedCurrency.symbol})</h3>
                    <p className="balance">{selectedCurrency.id === 'tstk' ? tokenBalance : '0.00'} {selectedCurrency.symbol}</p>
                </div>
                <div className="stat-card glass">
                    <h3>Tasa de Cambio</h3>
                    <p className="rate">1 {selectedCurrency.symbol} = ${selectedCurrency.price.toLocaleString()} USDX</p>
                </div>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'market' ? 'active' : ''}`}
                    onClick={() => setActiveTab('market')}
                >
                    Mercado
                </button>
                <button
                    className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Historial
                </button>
            </div>

            {activeTab === 'market' ? (
                <>
                    <CurrencyTable selectedSymbol={selectedCurrency.symbol} onSelect={setSelectedCurrency} />

                    <div className="trade-section">
                        <div className="trade-card buy">
                            <h3>Comprar {selectedCurrency.name}</h3>
                            <div className="input-group">
                                <label>Cantidad en USDX</label>
                                <input
                                    type="number"
                                    placeholder="0.0"
                                    value={buyAmount}
                                    onChange={(e) => setBuyAmount(e.target.value)}
                                />
                            </div>
                            <button onClick={handleBuy} disabled={loading} className="action-btn buy-btn">
                                {loading ? 'Procesando...' : `Comprar ${selectedCurrency.symbol}`}
                            </button>
                            <p className="hint-text">*Requiere aprobación previa</p>
                        </div>

                        <div className="trade-card sell">
                            <h3>Vender {selectedCurrency.name}</h3>
                            <div className="input-group">
                                <label>Cantidad en {selectedCurrency.symbol}</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={sellAmount}
                                    onChange={(e) => setSellAmount(e.target.value)}
                                />
                            </div>
                            <button onClick={handleSell} disabled={loading} className="action-btn sell-btn">
                                {loading ? 'Procesando...' : `Vender ${selectedCurrency.symbol}`}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <TransactionHistory
                    account={account}
                    marketContract={marketContract}
                    web3={web3Instance}
                />
            )}

            {status && <div className="status-toast">{status}</div>}

            <style>{`
                .dashboard-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 3rem;
                }

                .stat-card {
                    padding: 2rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.2s;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                }

                /* Tab Styles */
                .tabs-container {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 0.5rem;
                }

                .tab-btn {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    padding: 0.75rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    border-radius: 0.5rem;
                    transition: all 0.2s;
                    position: relative;
                }

                .tab-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.05);
                }

                .tab-btn.active {
                    color: white;
                    background: rgba(99, 102, 241, 0.1);
                }

                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -0.6rem;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #6366f1;
                    border-radius: 2px 2px 0 0;
                }

                .gradient-1 {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
                }

                .gradient-2 {
                    background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 63, 94, 0.2));
                }

                .glass {
                    background: rgba(30, 41, 59, 0.5);
                    backdrop-filter: blur(10px);
                }

                .stat-card h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1rem;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .stat-card .balance {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0;
                    background: linear-gradient(to right, #fff, #cbd5e1);
                    -webkit-background-clip: text;
                    color: transparent;
                }
                
                .stat-card .rate {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #e2e8f0;
                }

                .trade-section {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 2rem;
                }

                .trade-card {
                    background: #1e293b;
                    padding: 2.5rem;
                    border-radius: 1.5rem;
                    border: 1px solid #334155;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
                }

                .trade-card h3 {
                    margin: 0 0 2rem 0;
                    font-size: 1.5rem;
                    color: #f8fafc;
                }

                .input-group {
                    margin-bottom: 1.5rem;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #94a3b8;
                    font-size: 0.875rem;
                }

                input {
                    width: 100%;
                    padding: 1rem;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 0.75rem;
                    color: white;
                    font-size: 1.125rem;
                    transition: all 0.2s;
                    box-sizing: border-box;
                }

                input:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                }

                .action-btn {
                    width: 100%;
                    padding: 1rem;
                    border: none;
                    border-radius: 0.75rem;
                    font-size: 1.125rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, opacity 0.2s;
                }

                .action-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .buy-btn {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                }

                .sell-btn {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                }

                .status-toast {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    background: #334155;
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
                    border: 1px solid #475569;
                    animation: slideUp 0.3s ease-out;
                    z-index: 200;
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default TradeDashboard;
