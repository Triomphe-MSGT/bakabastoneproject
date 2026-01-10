import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Products.css';

const Products = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/collections/active';
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCollections(data);
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      // Fallback to default collections if API fails
      setCollections([
        { _id: 'fallback-1', name: 'Pierres Brutes', imageUrl: 'https://images.unsplash.com/photo-1599700403969-f77b37d63843?auto=format&fit=crop&q=80&w=800', description: 'Blocs naturels pour grands projets.' },
        { _id: 'fallback-2', name: 'Dallages', imageUrl: 'https://images.unsplash.com/photo-1621260646665-52319d672723?auto=format&fit=crop&q=80&w=800', description: 'Sols intérieurs et extérieurs élégants.' },
        { _id: 'fallback-3', name: 'Graviers & Sables', imageUrl: 'https://images.unsplash.com/photo-1558618007-d5008dbca8e9?auto=format&fit=crop&q=80&w=800', description: 'Pour allées et aménagements paysagers.' },
        { _id: 'fallback-4', name: 'Pierres de Taille', imageUrl: 'https://images.unsplash.com/photo-1599700403969-f77b37d63843?auto=format&fit=crop&q=80&w=800', description: 'Éléments architecturaux sur mesure.' },
      ]);
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

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Nos Collections</h1>
          <p className="page-subtitle">Une sélection rigoureuse de pierres naturelles pour tous vos projets.</p>
        </div>
      </div>

      <Section>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>Chargement des collections...</p>
          </div>
        ) : (
          <div className="products-grid">
            {collections.map((collection) => (
              <Card key={collection._id}>
                <CardImage 
                  src={getImageSrc(collection.imageUrl)} 
                  placeholder={collection.name} 
                  alt={collection.name} 
                />
                <CardContent>
                  <h3>{collection.name}</h3>
                  <p>{collection.description}</p>
                  <Link to={`/collection/${collection._id}`}>
                    <Button variant="text">Voir les produits</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default Products;
