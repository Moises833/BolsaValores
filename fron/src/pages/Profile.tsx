import { useAuth } from '../context/AuthContext';
import { User, Wallet, Shield, Mail, CreditCard, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import './Profile.css';

interface ProfileProps {
    account: string | null;
}

export default function Profile({ account }: ProfileProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="profile-page">
            <Header account={account} />
            <div className="profile-container">
                <div className="profile-card">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="profile-header">
                        <div className="avatar-large">
                            <User size={64} color="white" />
                        </div>
                        <h2>{user?.username}</h2>
                        <span className="role-badge">Trader Verificado</span>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <div className="icon-box"><Mail size={24} /></div>
                            <div className="detail-info">
                                <label>Correo Electrónico</label>
                                <div className="info-text">{user?.email}</div>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="icon-box"><CreditCard size={24} /></div>
                            <div className="detail-info">
                                <label>Cédula de Identidad</label>
                                <div className="info-text">{user?.cedula}</div>
                            </div>
                        </div>

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
