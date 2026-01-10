import React from 'react';
import Section from '../components/ui/Section';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Notre Histoire</h1>
          <p className="page-subtitle">Une passion pour la pierre transmise de génération en génération.</p>
        </div>
      </div>

      <Section>
        <div className="about-content">
          <div className="about-text">
            <h2>L'Excellence et la Passion</h2>
            <p>
              Fondée par M. Bakaba, expert passionné, notre entreprise a su évoluer 
              tout en conservant les techniques artisanales qui font la noblesse de notre métier.
            </p>
            <p>
              Aujourd'hui, nous allions savoir-faire technique et créativité pour offrir à nos clients 
              des solutions complètes : vente de produits décoratifs, pose, décoration et rénovation.
            </p>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">35+</span>
                <span className="stat-label">Années d'expérience</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projets réalisés</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15</span>
                <span className="stat-label">Artisans experts</span>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="img-placeholder">Atelier & Équipe</div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default About;
