import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, ChevronDown, UserCircle, Search } from 'lucide-react';

export default function Header({ account }: { account: string | null }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [searchCedula, setSearchCedula] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchCedula.trim()) return;

        // Check if user exists in our "db"
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const targetUser = users.find((u: any) => u.cedula === searchCedula.trim());

        if (targetUser) {
            navigate(`/trader/${targetUser.cedula}`);
            setSearchCedula('');
        } else {
            alert('Usuario no encontrado con esa cédula.');
        }
    };

    return (
        <header className="app-header">
            <div className="header-left">
                {account && <div className="wallet-pill">ETH: {account.slice(0, 6)}...{account.slice(-4)}</div>}
            </div>

            <div className="header-center">
                <Link to="/" className="header-title">
                    <h1>Bolsa de Valores Blockchain</h1>
                </Link>
            </div>

            <div className="header-right">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar por Cédula..."
                        value={searchCedula}
                        onChange={(e) => setSearchCedula(e.target.value)}
                    />
                    <button type="submit">
                        <Search size={16} />
                    </button>
                </form>

                <div className="user-menu-container">
                    <button className="user-menu-btn" onClick={() => setShowMenu(!showMenu)}>
                        <div className="user-icon">
                            <User size={20} />
                        </div>
                        <span className="username">{user?.username || 'Usuario'}</span>
                        <ChevronDown size={16} />
                    </button>

                    {showMenu && (
                        <div className="dropdown-menu">
                            <Link to="/profile" className="dropdown-item" onClick={() => setShowMenu(false)}>
                                <UserCircle size={18} />
                                <span>Mi Perfil</span>
                            </Link>
                            <button className="dropdown-item logout" onClick={handleLogout}>
                                <LogOut size={18} />
                                <span>Cerrar Sesión</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showMenu && <div className="overlay" onClick={() => setShowMenu(false)} />}
        </header>
    );
}
