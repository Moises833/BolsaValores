import { useAuth } from '../context/AuthContext';
import { User, Wallet, Shield } from 'lucide-react';
import Header from '../components/Header';
import './Profile.css'; // We'll create a specific CSS for profile or add to App.css

interface ProfileProps {
    account: string | null;
}

export default function Profile({ account }: ProfileProps) {
    const { user } = useAuth();

    return (
        <div className="profile-page">
            <Header account={account} />
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <div className="avatar-large">
                            <User size={64} color="white" />
                        </div>
                        <h2>{user?.username}</h2>
                        <span className="role-badge">Trader Verificado</span>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <div className="icon-box"><Wallet size={24} /></div>
                            <div className="detail-info">
                                <label>Billetera Conectada</label>
                                <div className="wallet-address">{account || 'No conectada'}</div>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="icon-box"><Shield size={24} /></div>
                            <div className="detail-info">
                                <label>Estado de Cuenta</label>
                                <div className="status-text">Activo</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
