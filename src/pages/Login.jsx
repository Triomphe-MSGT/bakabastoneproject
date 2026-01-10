import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = await login(username, password);
    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
    }
    // If success, redirect happens in AuthContext
  };

  return (
    <div className="login-container">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="login-bg-blob blob-blue" />
        <div className="login-bg-blob blob-purple" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="login-card"
      >
        <div className="login-header">
          <div className="icon-wrapper">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="login-title">Espace Admin</h2>
          <p className="login-subtitle">Accédez à votre tableau de bord sécurisé</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Identifiant</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <User size={20} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="Entrez votre identifiant"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={20} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                Se connecter
                <ArrowRight size={20} className="btn-icon" />
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="footer-text">
            Site Vitrine &copy; {new Date().getFullYear()} &bull; Administration
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
