import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Layers, Calendar, Tag, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './ProjectDetail.css';
import projectService from '../services/projectService';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/projects';
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await projectService.getProjectById(id);
      setProject(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return BASE_URL + imageUrl;
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <div className="loader"></div>
        <p>Chargement du projet...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-error">
        <h2>Projet non trouvé</h2>
        <Link to="/portfolio" className="back-link-dark">
          <ArrowLeft size={20} />
          Retour au portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <div className="project-detail-container">
        <Link to="/portfolio" className="back-link-dark mb-4">
          <ArrowLeft size={20} />
          Retour au portfolio
        </Link>

        <div className="project-detail-grid">
          {/* Image Section */}
          <motion.div 
            className="project-image-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src={getImageSrc(project.imageUrl)} 
              alt={project.title}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x800?text=No+Image'; }}
            />
          </motion.div>

          {/* Content Section */}
          <motion.div 
            className="project-content-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="project-category-badge">{project.category}</span>
            <h1 className="project-detail-title">{project.title}</h1>
            
            <div className="project-meta">
              <div className="meta-item">
                <Calendar size={18} />
                <span>Réalisé le {new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              {project.dimensions && (
                <div className="meta-item">
                  <Maximize2 size={18} />
                  <span>{project.dimensions}</span>
                </div>
              )}
              {project.totalPrice > 0 && (
                <div className="meta-item">
                  <Tag size={18} />
                  <span>Coût total: {project.totalPrice.toLocaleString()} FCFA</span>
                </div>
              )}
            </div>

            <div className="project-description-section">
              <h3>À propos de ce projet</h3>
              <p>{project.description}</p>
            </div>

            {project.materials && project.materials.length > 0 && (
              <div className="project-materials-section">
                <h3>Matériaux utilisés</h3>
                <div className="materials-list">
                  {project.materials.map((material, index) => (
                    <div key={index} className="material-tag">
                      <Layers size={16} />
                      <span>{material}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
