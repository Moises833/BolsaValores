
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, Calendar } from 'lucide-react';

interface Transaction {
    hash: string;
    type: 'buy' | 'sell';
    amountStock: string;
    amountFiat: string;
    timestamp: number;
    date: string;
}

interface Props {
    account: string;
    marketContract: any;
    web3: any;
}

export default function TransactionHistory({ account, marketContract, web3 }: Props) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!account || !marketContract || !web3) return;

            setLoading(true);
            try {
                // Fetch Buy Events
                const buyEvents = await marketContract.getPastEvents('TokensPurchased', {
                    filter: { buyer: account },
                    fromBlock: 0,
                    toBlock: 'latest'
                });

                // Fetch Sell Events
                const sellEvents = await marketContract.getPastEvents('TokensSold', {
                    filter: { seller: account },
                    fromBlock: 0,
                    toBlock: 'latest'
                });

                const formatEvents = async (events: any[], type: 'buy' | 'sell') => {
                    return Promise.all(events.map(async (e) => {
                        const block = await web3.eth.getBlock(e.blockNumber);
                        // block.timestamp is in seconds
                        const timestamp = Number(block.timestamp) * 1000;
                        const date = new Date(timestamp);

                        return {
                            hash: e.transactionHash,
                            type,
                            amountStock: web3.utils.fromWei(e.returnValues.amountOfStock, 'ether'),
                            amountFiat: web3.utils.fromWei(e.returnValues.amountOfFiat, 'ether'),
                            timestamp,
                            date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                        };
                    }));
                };

                const buys = await formatEvents(buyEvents, 'buy');
                const sells = await formatEvents(sellEvents, 'sell');

                const allTxs = [...buys, ...sells].sort((a, b) => b.timestamp - a.timestamp);
                setTransactions(allTxs);

            } catch (error) {
                console.error("Error fetching history:", error);
            }
            setLoading(false);
        };

        fetchHistory();
    }, [account, marketContract, web3]);

    if (loading) {
        return <div className="loading-state">Cargando historial...</div>;
    }

    if (transactions.length === 0) {
        return (
            <div className="empty-state">
                <Clock size={48} className="empty-icon" />
                <h3>No hay movimientos aún</h3>
                <p>Tus operaciones de compra y venta aparecerán aquí.</p>
            </div>
        );
    }

    return (
        <div className="history-container glass">
            <h3>Historial de Movimientos</h3>
            <div className="table-responsive">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Cantidad (TSTK)</th>
                            <th>Total (USDX)</th>
                            <th>Fecha</th>
                            <th>Hash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.hash}>
                                <td className={`type-cell ${tx.type}`}>
                                    {tx.type === 'buy' ? (
                                        <><ArrowDownRight size={16} /> Compra</>
                                    ) : (
                                        <><ArrowUpRight size={16} /> Venta</>
                                    )}
                                </td>
                                <td className="amount">{parseFloat(tx.amountStock).toFixed(2)} TSTK</td>
                                <td className="total">${parseFloat(tx.amountFiat).toFixed(2)}</td>
                                <td className="date">
                                    <Calendar size={14} />
                                    {tx.date}
                                </td>
                                <td className="hash">
                                    <a
                                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Ver en Etherscan"
                                    >
                                        {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .history-container {
                    padding: 2rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    animation: fadeIn 0.3s ease-out;
                }

                .loading-state, .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                    color: #94a3b8;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .empty-icon {
                    color: #475569;
                    margin-bottom: 0.5rem;
                }

                .history-table {
                    width: 100%;
                    border-collapse: collapse;
                    color: #cbd5e1;
                }

                .history-table th {
                    text-align: left;
                    padding: 1rem;
                    color: #94a3b8;
                    font-weight: 500;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .history-table td {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    vertical-align: middle;
                }

                .type-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .type-cell.buy { color: #4ade80; }
                .type-cell.sell { color: #f87171; }

                .amount {
                    font-weight: 500;
                    color: #f8fafc;
                }

                .total {
                    font-family: monospace;
                    color: #e2e8f0;
                }

                .date {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .hash a {
                    color: #6366f1;
                    text-decoration: none;
                    background: rgba(99, 102, 241, 0.1);
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    font-size: 0.85rem;
                    transition: all 0.2s;
                }

                .hash a:hover {
                    background: rgba(99, 102, 241, 0.2);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
