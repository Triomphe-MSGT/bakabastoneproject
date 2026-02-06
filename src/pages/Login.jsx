import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        const adminPath = import.meta.env.VITE_ADMIN_PATH || '/admin';
        navigate(`${adminPath}/dashboard`);
      } else {
        setError('Identifiants incorrects.');
      }
    } catch (err) {
      setError('Erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-blob blob-blue"></div>
      <div className="login-bg-blob blob-purple"></div>
      <div className="login-card">
        <div className="login-header">
          <div className="icon-wrapper"><ShieldCheck size={32} /></div>
          <h1 className="login-title">Identification Admin</h1>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Identifiant</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input type="text" className="form-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Entrer <ArrowRight size={18} className="btn-icon" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
