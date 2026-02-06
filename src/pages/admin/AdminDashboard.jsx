import React, { useEffect, useState } from "react";
import { FolderKanban, MessageSquare, Gem, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";
import projectService from "../../services/projectService";
import messageService from "../../services/messageService";
import collectionService from "../../services/collectionService";
import expertiseService from "../../services/expertiseService";

const StatCard = ({ title, value, icon: LucideIcon, trend }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-icon">
        <LucideIcon size={24} />
      </div>
      {trend && <span className="stat-trend">{trend}</span>}
    </div>
    <div>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-label">{title}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    unreadMessages: 0,
    collections: 0,
    expertise: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.token) {
      fetchData();
      
      // Refresh dashboard data every 30 seconds
      const intervalId = setInterval(fetchData, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const fetchData = async () => {
      try {
        const [projectsData, messagesData, collectionsData, expertiseData] = await Promise.all([
          projectService.getAllProjects(),
          messageService.getMessages(),
          collectionService.getAllCollections(),
          expertiseService.getAllExpertise(),
        ]);

        // Calculate stats dealing with paginated or array responses
        let projectCount = 0;
        if (projectsData.totalProjects !== undefined) {
             projectCount = projectsData.totalProjects;
        } else if (projectsData.projects && Array.isArray(projectsData.projects)) {
             projectCount = projectsData.projects.length;
        } else if (Array.isArray(projectsData)) {
             projectCount = projectsData.length;
        }

        const messageCount = Array.isArray(messagesData) ? messagesData.length : 0;
        const unreadCount = Array.isArray(messagesData) ? messagesData.filter(m => !m.read).length : 0;
        
        let collectionCount = 0;
        if (collectionsData.totalCollections !== undefined) {
            collectionCount = collectionsData.totalCollections;
        } else if (collectionsData.collections && Array.isArray(collectionsData.collections)) {
            collectionCount = collectionsData.collections.length;
        } else if (Array.isArray(collectionsData)) {
            collectionCount = collectionsData.length;
        }

        const expertiseCount = Array.isArray(expertiseData) ? expertiseData.length : 0;

        setStats({
          projects: projectCount,
          messages: messageCount,
          unreadMessages: unreadCount,
          collections: collectionCount,
          expertise: expertiseCount,
        });

        // Get recent messages for activity
        if (Array.isArray(messagesData)) {
          const sortedMessages = messagesData.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ).slice(0, 5);
          setRecentActivity(sortedMessages);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) return `Il y a ${hours} heures`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Vue d'ensemble</h2>
        <p className="dashboard-subtitle">
          Voici ce qui se passe sur votre site aujourd'hui.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Projets en ligne"
          value={loading ? "-" : stats.projects}
          icon={FolderKanban}
          trend="Total"
        />
        <StatCard
          title="Messages reçus"
          value={loading ? "-" : stats.messages}
          icon={MessageSquare}
          trend={stats.unreadMessages > 0 ? `${stats.unreadMessages} non lu(s)` : "Tous lus"}
        />
        <StatCard
          title="Collections actives"
          value={loading ? "-" : stats.collections}
          icon={Gem}
          trend="Total"
        />
        <StatCard
          title="Services / Expertises"
          value={loading ? "-" : stats.expertise}
          icon={Award}
          trend="Total"
        />
      </div>

      <div className="content-grid">
        <div className="content-main dashboard-card">
          <h3 className="card-title">Statistiques des visites</h3>
          <div className="chart-placeholder">
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-light)" }}>
              Graphique des visites (Simulation)
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Activité récente (Messages)</h3>
          <div className="activity-list">
            {loading ? (
              <div style={{ padding: "1rem" }}>Chargement...</div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((msg) => (
                <div key={msg._id} className="activity-item">
                  <div className="activity-dot" />
                  <div className="activity-content">
                    <p className="activity-title">Message de {msg.name}</p>
                    <p className="activity-time">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: "1rem", color: "var(--color-text-light)" }}>
                Aucune activité récente.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
