import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, Settings, LogOut, Gem, Award, Users, MessageCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const adminPath = import.meta.env.VITE_ADMIN_PATH || '/admin';

  const menuItems = [
    { path: `${adminPath}/dashboard`, icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: `${adminPath}/collections`, icon: Gem, label: 'Collections' },
    { path: `${adminPath}/expertise`, icon: Award, label: 'Expertise' },
    { path: `${adminPath}/projects`, icon: FolderKanban, label: 'Projets' },
    { path: `${adminPath}/team`, icon: Users, label: 'Notre Équipe' },
    { path: `${adminPath}/testimonials`, icon: MessageCircle, label: 'Témoignages' },
    { path: `${adminPath}/messages`, icon: MessageSquare, label: 'Messages' },
    { path: `${adminPath}/settings`, icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h1 className="sidebar-title">Admin Panel</h1>
          <p className="sidebar-welcome">Bienvenue, {user?.username}</p>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
             <button 
              onClick={toggleTheme} 
              className="logout-btn" 
              style={{ justifyContent: 'center', color: 'var(--color-secondary)' }}
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span style={{ marginLeft: '0.5rem' }}>Thème</span>
            </button>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h2 className="header-title">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Administration'}
          </h2>
          <div className="header-actions">
            <button 
              onClick={toggleTheme} 
              className="header-btn theme-toggle"
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="header-avatar">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            
            <button 
              onClick={logout} 
              className="header-btn logout-btn-mobile"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        
        <div className="admin-content">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
