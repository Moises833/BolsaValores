import { ArrowUpRight, ArrowDownRight, Apple, Search, ShoppingCart, Zap, Cpu, Users, Tv, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useMemo } from 'react';

export interface Stock {
    id: string;
    symbol: string;
    name: string;
    price: number;
    change: number;
    icon: any;
}

export const MOCK_STOCKS: Stock[] = [
    { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', price: 185.50, change: 1.8, icon: Apple },
    { id: 'msft', symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.25, change: 0.5, icon: Cpu },
    { id: 'googl', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, change: -0.3, icon: Search },
    { id: 'amzn', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.30, change: 2.1, icon: ShoppingCart },
    { id: 'tsla', symbol: 'TSLA', name: 'Tesla Inc.', price: 248.75, change: -1.5, icon: Zap },
    { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.20, change: 3.4, icon: Cpu },
    { id: 'meta', symbol: 'META', name: 'Meta Platforms', price: 352.90, change: 1.2, icon: Users },
    { id: 'nflx', symbol: 'NFLX', name: 'Netflix Inc.', price: 485.60, change: -0.8, icon: Tv },
];

type SortField = 'name' | 'price' | 'change' | 'balance';
type SortDirection = 'asc' | 'desc';

interface Props {
    selectedSymbol: string;
    onSelect: (stock: Stock) => void;
    balances: { [symbol: string]: number };
}

export default function StockTable({ selectedSymbol, onSelect, balances }: Props) {
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

    const sortedStocks = useMemo(() => {
        const sorted = [...MOCK_STOCKS].sort((a, b) => {
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
            <h3>Mercado de Acciones</h3>
            <div className="table-responsive">
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th className="sortable" onClick={() => handleSort('name')}>
                                <span className="th-content">
                                    Empresa <SortIcon field="name" />
                                </span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('price')}>
                                <span className="th-content">
                                    Precio (USDX) <SortIcon field="price" />
                                </span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('balance')}>
                                <span className="th-content">
                                    Tu Balance <SortIcon field="balance" />
                                </span>
                            </th>
                            <th className="sortable" onClick={() => handleSort('change')}>
                                <span className="th-content">
                                    Cambio (24h) <SortIcon field="change" />
                                </span>
                            </th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStocks.map((stock) => {
                            const Icon = stock.icon;
                            const isSelected = selectedSymbol === stock.symbol;
                            const isPositive = stock.change >= 0;

                            return (
                                <tr
                                    key={stock.id}
                                    className={isSelected ? 'selected-row' : ''}
                                    onClick={() => onSelect(stock)}
                                >
                                    <td className="stock-info">
                                        <div className="stock-icon">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <span className="stock-symbol">{stock.symbol}</span>
                                            <span className="stock-name">{stock.name}</span>
                                        </div>
                                    </td>
                                    <td className="price">${stock.price.toLocaleString()}</td>
                                    <td className="balance-cell">
                                        {(balances[stock.symbol] || 0).toFixed(4)} {stock.symbol}
                                    </td>
                                    <td className={`change ${isPositive ? 'positive' : 'negative'}`}>
                                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                        {Math.abs(stock.change)}%
                                    </td>
                                    <td>
                                        <button
                                            className={`select-btn ${isSelected ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelect(stock);
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

                .stock-table {
                    width: 100%;
                    border-collapse: collapse;
                    color: #cbd5e1;
                }

                .stock-table th {
                    text-align: left;
                    padding: 1rem;
                    color: #94a3b8;
                    font-weight: 500;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .stock-table th.sortable {
                    cursor: pointer;
                    user-select: none;
                    transition: background 0.2s, color 0.2s;
                }

                .stock-table th.sortable:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #cbd5e1;
                }

                .th-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .stock-table td {
                    padding: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    vertical-align: middle;
                }

                .stock-table tr {
                    transition: background 0.2s;
                    cursor: pointer;
                }

                .stock-table tr:hover {
                    background: rgba(255, 255, 255, 0.02);
                }

                .stock-table tr.selected-row {
                    background: rgba(99, 102, 241, 0.1);
                    border-left: 2px solid #6366f1;
                }

                .stock-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .balance-cell {
                    color: #fff;
                    font-family: monospace;
                    font-weight: 500;
                }

                .stock-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(51, 65, 85, 0.5);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #e2e8f0;
                }

                .stock-symbol {
                    display: block;
                    font-weight: 600;
                    color: #f8fafc;
                }

                .stock-name {
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
