import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import './Portfolio.css';

const Portfolio = () => {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="portfolio-page">
        <div className="page-header">
          <div className="container">
            <h1 className="page-title">Nos Réalisations</h1>
          </div>
        </div>
        <Section>
          <div className="text-center py-12">Chargement...</div>
        </Section>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Nos Réalisations</h1>
          <p className="page-subtitle">Découvrez comment nous transformons la pierre en art.</p>
        </div>
      </div>

      <Section>
        <div className="portfolio-grid">
          {projects.map((project) => (
            <Link to={`/project/${project._id}`} key={project._id} className="portfolio-item">
              <div className="portfolio-image">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl.startsWith('http') ? project.imageUrl : `http://localhost:5000${project.imageUrl}`} 
                    alt={project.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="img-placeholder">{project.title}</div>
                )}
              </div>
              <div className="portfolio-overlay">
                <div className="portfolio-content">
                  <span className="portfolio-category">{project.category}</span>
                  <h3>{project.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default Portfolio;
