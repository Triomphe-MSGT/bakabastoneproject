import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, Settings, LogOut, Gem, Award, Users, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/admin/collections', icon: Gem, label: 'Collections' },
    { path: '/admin/expertise', icon: Award, label: 'Expertise' },
    { path: '/admin/projects', icon: FolderKanban, label: 'Projets' },
    { path: '/admin/team', icon: Users, label: 'Notre Équipe' },
    { path: '/admin/testimonials', icon: MessageCircle, label: 'Témoignages' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/settings', icon: Settings, label: 'Paramètres' },
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
          <div className="header-avatar">
            {user?.username?.[0]?.toUpperCase()}
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
