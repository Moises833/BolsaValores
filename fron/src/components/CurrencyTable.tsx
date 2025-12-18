
import { ArrowUpRight, ArrowDownRight, Bitcoin, Cpu, Globe, Zap, Database, ArrowUp, ArrowDown, Tag, DollarSign, Wallet, TrendingUp, MousePointer } from 'lucide-react';
import { useState, useMemo } from 'react';

export interface Currency {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    icon: any;
}

export const MOCK_CURRENCIES: Currency[] = [
    { id: 'tstk', symbol: 'TSTK', name: 'TechStock Token', price: 0.01, change: 2.5, icon: Zap },
    { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 45000, change: -1.2, icon: Bitcoin },
    { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3200, change: 0.8, icon: Database },
    { id: 'sol', symbol: 'SOL', name: 'Solana', price: 110, change: 5.4, icon: Cpu },
    { id: 'ada', symbol: 'ADA', name: 'Cardano', price: 0.55, change: -0.5, icon: Globe },
];

type SortField = 'name' | 'price' | 'change' | 'balance';
type SortDirection = 'asc' | 'desc';

interface Props {
    selectedSymbol: string;
    onSelect: (currency: Currency) => void;
    balances: { [symbol: string]: number };
}

export default function CurrencyTable({ selectedSymbol, onSelect, balances }: Props) {
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedCurrencies = useMemo(() => {
        const sorted = [...MOCK_CURRENCIES].sort((a, b) => {
            let comparison = 0;

            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'change':
                    comparison = a.change - b.change;
                    break;
                case 'balance':
                    const balanceA = balances[a.symbol] || 0;
                    const balanceB = balances[b.symbol] || 0;
                    comparison = balanceA - balanceB;
                    break;
            }

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [sortField, sortDirection, balances]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <div className="market-table-container glass">
            <h3>Mercado de Divisas Digitales</h3>
            <div className="table-responsive">
                <table className="currency-table">
                    <thead>
                        <tr>
                            <th className="sortable" onClick={() => handleSort('name')}>
                                <span className="th-content">
                                    <Tag size={16} /> Moneda <SortIcon field="name" />
                                </span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('price')}>
                                <span className="th-content">
                                    <DollarSign size={16} /> Precio (USDX) <SortIcon field="price" />
                                </span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('balance')}>
                                <span className="th-content">
                                    <Wallet size={16} /> Tu Balance <SortIcon field="balance" />
                                </span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('change')}>
                                <span className="th-content">
                                    <TrendingUp size={16} /> Cambio (24h) <SortIcon field="change" />
                                </span>
                            </th>
                            <th>
                                <span className="th-content">
                                    <MousePointer size={16} /> Acción
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedCurrencies.map((currency) => {
                            const Icon = currency.icon;
                            const isSelected = selectedSymbol === currency.symbol;
                            const isPositive = currency.change >= 0;

                            return (
                                <tr
                                    key={currency.id}
                                    className={isSelected ? 'selected-row' : ''}
                                    onClick={() => onSelect(currency)}
                                >
                                    <td className="coin-info">
                                        <div className="coin-icon">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <span className="coin-symbol">{currency.symbol}</span>
                                            <span className="coin-name">{currency.name}</span>
                                        </div>
                                    </td>
                                    <td className="price">${currency.price.toLocaleString()}</td>
                                    <td className="balance-cell">
                                        {(balances[currency.symbol] || 0).toFixed(4)} {currency.symbol}
                                    </td>
                                    <td className={`change ${isPositive ? 'positive' : 'negative'}`}>
                                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                        {Math.abs(currency.change)}%
                                    </td>
                                    <td>
                                        <button
                                            className={`select-btn ${isSelected ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(currency);
                                            }}
                                        >
                                            {isSelected ? 'Seleccionado' : 'Operar'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <style>{`
                .market-table-container {
                    padding: 2rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 2rem;
                }

                h3 {
                    margin: 0 0 1.5rem 0;
                    color: #f8fafc;
                    font-size: 1.25rem;
                }

                .table-responsive {
                    overflow-x: auto;
                }

                .currency-table {
                    width: 100%;
                    border-collapse: collapse;
                    color: #cbd5e1;
                }

                .currency-table th {
                    text-align: left;
                    padding: 1rem;
                    color: #94a3b8;
                    font-weight: 500;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .currency-table th.sortable {
                    cursor: pointer;
                    user-select: none;
                    transition: background 0.2s, color 0.2s;
                }

                .currency-table th.sortable:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #cbd5e1;
                }

                .th-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .currency-table td {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    vertical-align: middle;
                }

                .currency-table tr {
                    transition: background 0.2s;
                    cursor: pointer;
                }

                .currency-table tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                .currency-table tr.selected-row {
                    background: rgba(99, 102, 241, 0.1);
                    border-left: 2px solid #6366f1;
                }

                .coin-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .balance-cell {
                    color: #fff;
                    font-family: monospace;
                    font-weight: 500;
                }

                .coin-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(51, 65, 85, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #e2e8f0;
                }

                .coin-symbol {
                    display: block;
                    font-weight: 600;
                    color: #f8fafc;
                }

                .coin-name {
                    font-size: 0.85rem;
                    color: #94a3b8;
                }

                .price {
                    font-weight: 600;
                    color: #f8fafc;
                }

                .change {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-weight: 500;
                }

                .change.positive {
                    color: #4ade80;
                }

                .change.negative {
                    color: #f87171;
                }

                .select-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: transparent;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.85rem;
                }

                .select-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .select-btn.active {
                    background: #4f46e5;
                    border-color: #4f46e5;
                }
            `}</style>
        </div>
    );
}
