import { useParams, useNavigate } from 'react-router-dom';
import { User, Shield, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import '../pages/Profile.css';

export default function PublicProfile() {
    const { cedula } = useParams();
    const navigate = useNavigate();

    // Find user
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.cedula === cedula);

    if (!foundUser) {
        return (
            <div className="profile-page">
                <Header account={null} />
                <div className="profile-container">
                    <div className="error-msg">Usuario no encontrado</div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Header account={null} />
            <div className="profile-container">
                <div className="profile-card">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="profile-header">
                        <div className="avatar-large">
                            <User size={64} color="white" />
                        </div>
                        <h2>{foundUser.username}</h2>
                        <span className="role-badge">Trader Público</span>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <div className="icon-box"><Shield size={24} /></div>
                            <div className="detail-info">
                                <label>Cédula</label>
                                <div className="info-text">{foundUser.cedula}</div>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="icon-box"><Shield size={24} /></div>
                            <div className="detail-info">
                                <label>Estado</label>
                                <div className="status-text">Activo</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
