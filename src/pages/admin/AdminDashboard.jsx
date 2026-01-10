import React, { useEffect, useState } from 'react';
import { FolderKanban, MessageSquare, Users, TrendingUp } from 'lucide-react';
import './AdminDashboard.css';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      {trend && (
        <span className="stat-trend">
          {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-label">{title}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    views: 1250,
  });

  useEffect(() => {
    // Fetch real stats here
    setStats(prev => ({ ...prev, projects: 5, messages: 12 }));
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Vue d'ensemble</h2>
        <p className="dashboard-subtitle">Voici ce qui se passe sur votre site aujourd'hui.</p>
      </div>
      
      <div className="stats-grid">
        <StatCard 
          title="Projets en ligne" 
          value={stats.projects} 
          icon={FolderKanban} 
          trend="+2 cette semaine"
        />
        <StatCard 
          title="Messages reçus" 
          value={stats.messages} 
          icon={MessageSquare} 
          trend="+5 nouveaux"
        />
        <StatCard 
          title="Visiteurs uniques" 
          value={stats.views} 
          icon={Users} 
          trend="+12% vs mois dernier"
        />
        <StatCard 
          title="Taux de conversion" 
          value="3.2%" 
          icon={TrendingUp} 
          trend="+0.4%"
        />
      </div>

      <div className="content-grid">
        <div className="content-main dashboard-card">
          <h3 className="card-title">Statistiques des visites</h3>
          <div className="chart-placeholder">
            Graphique des visites (à implémenter)
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Activité récente</h3>
          <div className="activity-list">
            {[1, 2, 3].map((i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <p className="activity-title">Nouveau message de contact</p>
                  <p className="activity-time">Il y a {i} heures</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
