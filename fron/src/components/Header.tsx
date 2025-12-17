import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, ChevronDown, UserCircle } from 'lucide-react';

export default function Header({ account }: { account: string | null }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                {/* Placeholder for balance logic or other items if needed */}
                {account && <div className="wallet-pill">ETH: {account.slice(0, 6)}...{account.slice(-4)}</div>}
            </div>

            <div className="header-center">
                <h1>Bolsa de Valores Blockchain</h1>
            </div>

            <div className="header-right">
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

            {/* Click outside listener could be added here for robustness */}
            {showMenu && <div className="overlay" onClick={() => setShowMenu(false)} />}
        </header>
    );
}
