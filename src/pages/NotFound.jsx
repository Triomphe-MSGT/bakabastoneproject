import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="not-found-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <Section className="text-center">
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Non Trouvée</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--color-secondary)' }}>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Button to="/">Retour à l'accueil</Button>
      </Section>
    </div>
  );
};

export default NotFound;
