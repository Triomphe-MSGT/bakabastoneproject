import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);



  const login = async (username, password) => {
    try {
      const data = await authService.login({ username, password });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      navigate('/admin');
      return { success: true };
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return { success: false, message: error.response.data.message || 'Identifiants invalides' };
      }
      return { success: false, message: error.message || 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
