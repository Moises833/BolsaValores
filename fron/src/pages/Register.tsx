import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 4) {
            setError('La contraseña es muy corta (min 4 caracteres)');
            return;
        }

        setLoading(true);

        try {
            const success = await register(username, password);
            if (success) {
                navigate('/');
            } else {
                setError('El usuario ya existe');
            }
        } catch (err) {
            setError('Ocurrió un error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="icon-header">
                    <UserPlus size={40} className="icon-accent" />
                </div>
                <h2>Crear Cuenta</h2>
                <p className="subtitle">Únete al mercado descentralizado</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Usuario</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Elige un nombre de usuario"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <p className="footer-text">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                </p>
            </div>
        </div>
    );
}
