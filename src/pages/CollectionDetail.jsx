import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Star, Award, Shield, Tag, XCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './CollectionDetail.css';
import collectionService from '../services/collectionService';

const CollectionDetail = () => {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = '/api/collections';
  const BASE_URL = '';

  useEffect(() => {
    fetchCollection();
  }, [id]);

  const fetchCollection = async () => {
    try {
      const data = await collectionService.getCollectionById(id);
      setCollection(data);
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
      <div className="collection-detail-loading">
        <div className="loader"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="collection-detail-error">
        <h2>Collection non trouvée</h2>
        <Link to="/products" className="back-link">
          <ArrowLeft size={20} />
          Retour aux collections
        </Link>
      </div>
    );
  }

  // Default expert description if none provided
  const expertDesc = collection.expertDescription || `
    Cette collection de ${collection.name.toLowerCase()} représente l'excellence de notre savoir-faire. 
    Chaque pièce est soigneusement sélectionnée par nos experts pour garantir une qualité irréprochable.
    Nos pierres proviennent des meilleures carrières et sont traitées avec le plus grand soin pour 
    préserver leur beauté naturelle et leur durabilité exceptionnelle.
  `;

  // Default features if none provided
  const features = collection.features?.length > 0 ? collection.features : [
    'Pierre 100% naturelle',
    'Résistance exceptionnelle au gel',
    'Entretien minimal requis',
    'Garantie 25 ans',
    'Livraison sur site incluse',
    'Conseils d\'installation gratuits'
  ];

  return (
    <div className="collection-detail-page">
      {/* Hero Section */}
      <div className="collection-hero">
        <motion.div 
          className="collection-hero-image"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src={getImageSrc(collection.imageUrl)} 
            alt={collection.name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x800?text=No+Image'; }}
          />
          <div className="hero-overlay"></div>
        </motion.div>
        
        <div className="hero-content">
          <Link to="/products" className="back-link">
            <ArrowLeft size={20} />
            Retour aux collections
          </Link>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span className="collection-badge">Collection Premium</span>
            </div>
            <h1 className="collection-title">{collection.name}</h1>
            <p className="collection-short-desc">{collection.description}</p>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', color: 'white', fontWeight: '500' }}>
               {collection.pricePerM2 > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tag size={20} color="var(--color-accent)" /> 
                    <span>{collection.pricePerM2.toLocaleString()} FCFA <small style={{ opacity: 0.8 }}>/ m²</small></span>
                  </div>
               )}
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {collection.isAvailable ? (
                    <><CheckCircle size={20} color="#4ade80" /> <span>En stock immédiat</span></>
                  ) : (
                    <><XCircle size={20} color="#fbbf24" /> <span>Disponible sur commande</span></>
                  )}
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="collection-content">
        <div className="container">
          <div className="content-grid">
            {/* Left Column - Expert Description */}
            <motion.div 
              className="expert-section"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="expert-header">
                <Award className="expert-icon" size={32} />
                <div>
                  <h2>Avis d'Expert</h2>
                  <p className="expert-subtitle">Par notre équipe de géologues</p>
                </div>
              </div>
              
              <div className="expert-content">
                <p>{expertDesc}</p>
              </div>
              
              <div className="quality-badges">
                <div className="quality-badge">
                  <Star size={20} />
                  <span>Qualité Premium</span>
                </div>
                <div className="quality-badge">
                  <Shield size={20} />
                  <span>Certifié CE</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Features & CTA */}
            <motion.div 
              className="features-section"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="features-card">
                <h3>Caractéristiques</h3>
                <ul className="features-list">
                  {features.map((feature, index) => (
                    <li key={index}>
                      <Check size={18} className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="cta-section">
                <h3>Intéressé par cette collection ?</h3>
                <p>Contactez-nous pour un devis personnalisé ou visitez notre showroom.</p>
                <div className="cta-buttons">
                  <Link to="/contact" className="btn-primary">
                    Demander un devis
                  </Link>
                  <a href="tel:+33123456789" className="btn-secondary">
                    Nous appeler
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="gallery-section">
        <div className="container">
          <h2 className="section-title">Aperçu de la Collection</h2>
          <div className="gallery-grid">
            <motion.div 
              className="gallery-item main"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={getImageSrc(collection.imageUrl)} 
                alt={`${collection.name} - Vue principale`}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
