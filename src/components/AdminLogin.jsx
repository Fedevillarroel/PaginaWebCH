import { useState } from 'react';
import { Shield, User, Lock, AlertCircle } from 'lucide-react';
import './AdminLogin.css';

// ── Credenciales ─────────────────────────────────────────
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Administrador_2026';

const AdminLogin = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Pequeño delay para simular verificación (evita fuerza bruta visual)
    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Guardar sesión en sessionStorage (se borra al cerrar el tab)
        sessionStorage.setItem('ch_admin_auth', 'true');
        onSuccess();
      } else {
        setError('Usuario o contraseña incorrectos.');
        setPassword('');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-card">

        {/* Logo */}
        <div className="admin-login-logo">
          <div className="admin-login-icon">
            <Shield size={26} />
          </div>
          <h1 className="admin-login-title">Panel de Administración</h1>
          <p className="admin-login-subtitle">Cristian Heintz · Acceso Restringido</p>
        </div>

        {/* Form */}
        <form className="admin-login-form" onSubmit={handleSubmit} autoComplete="off">

          <div className="admin-login-field">
            <label htmlFor="admin-username">Usuario</label>
            <div className="admin-login-input-wrap">
              <User size={16} />
              <input
                id="admin-username"
                type="text"
                className="admin-login-input"
                placeholder="Ingresá tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="admin-login-field">
            <label htmlFor="admin-password">Contraseña</label>
            <div className="admin-login-input-wrap">
              <Lock size={16} />
              <input
                id="admin-password"
                type="password"
                className="admin-login-input"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="admin-login-error">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading || !username || !password}
          >
            {loading ? 'Verificando...' : 'Ingresar al panel'}
          </button>
        </form>

        <p className="admin-login-hint">
          Acceso solo para administradores autorizados
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
