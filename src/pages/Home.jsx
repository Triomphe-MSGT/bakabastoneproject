import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [expertises, setExpertises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpertises();
  }, []);

  const fetchExpertises = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/expertise/active');
      const data = await response.json();
      setExpertises(data);
    } catch (error) {
      console.error('Erreur lors du chargement des expertises:', error);
      // Fallback data
      setExpertises([
        { _id: 1, title: 'Vente de Produits Décoratifs', description: 'Une large sélection de pierres et matériaux pour sublimer votre intérieur et extérieur.', icon: '01' },
        { _id: 2, title: 'Pose des Pierres', description: 'Une équipe d\'artisans qualifiés pour une installation durable et esthétique.', icon: '02' },
        { _id: 3, title: 'Idée de Décoration', description: 'Conseils et accompagnement pour réaliser vos projets de décoration.', icon: '03' },
        { _id: 4, title: 'Traitement et Rénovation', description: 'Entretien et remise à neuf de vos surfaces en pierre.', icon: '04' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            L'Art de la Pierre <br />
            <span className="text-accent">Naturelle</span>
          </motion.h1>
          <p className="hero-subtitle">
            Vente de produits décoratifs, pose de pierres, conseils en décoration et rénovation pour sublimer vos espaces.
            Du brut au raffiné, nous façonnons vos projets.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">Découvrir nos pierres</Link>
            <Link to="/contact" className="btn hero-btn-outline">Demander un devis</Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Notre Expertise</h2>
            <div className="section-line"></div>
          </div>
          
          <div className="services-grid">
            {expertises.map((item) => (
              <div key={item._id} className="service-card">
                <div className="service-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="section featured bg-light">
        <div className="container">
          <div className="split-layout">
            <div className="split-content">
              <h2 className="section-title">Matériaux d'Exception</h2>
              <p className="section-desc">
                Nous sélectionnons rigoureusement nos pierres pour leur qualité et leur caractère unique.
                Découvrez nos parements en pierre naturelle et briquettes pour un rendu authentique et chaleureux.
              </p>
              <ul className="feature-list">
                <li><CheckCircle size={20} className="text-accent" /> Produits décoratifs de qualité</li>
                <li><CheckCircle size={20} className="text-accent" /> Pose et rénovation experte</li>
                <li><CheckCircle size={20} className="text-accent" /> Conseils en décoration</li>
              </ul>
              <Link to="/products" className="btn btn-primary mt-md">Voir le catalogue <ArrowRight size={16} style={{display:'inline', verticalAlign:'middle'}} /></Link>
            </div>
            <div className="split-image-grid">
              <img src="/images/stone-1.png" alt="Pierres naturelles" className="stone-img main-img" />
              <div className="small-images">
                <img src="/images/stone-house.png" alt="Maison en pierre" className="stone-img" />
                <img src="/images/stone-texture.png" alt="Texture pierre" className="stone-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technician Section */}
      <section className="section technician-section">
        <div className="container">
          <div className="split-layout reverse">
            <div className="split-image">
              <img src="/images/technician-bakaba.png" alt="M. Bakaba, Maître Artisan" className="technician-img" />
            </div>
            <div className="split-content">
              <h2 className="section-title">Le Maître Artisan</h2>
              <h3 className="technician-name">M. Bakaba</h3>
              <p className="section-desc">
                Fondateur et expert passionné, M. Bakaba met son savoir-faire unique au service de vos projets. 
                Avec des années d'expérience dans la taille et la pose de pierre, il garantit une finition irréprochable 
                et une esthétique qui traverse le temps.
              </p>
              <p className="section-desc">
                "Chaque pierre a une histoire, et mon travail est de la raconter à travers votre habitat."
              </p>
              <Link to="/contact" className="btn btn-outline">Prendre rendez-vous</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
