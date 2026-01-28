import React, { useState } from 'react';
import { Star, Send, Loader2, CheckCircle } from 'lucide-react';
import './TestimonialForm.css';
import testimonialService from '../services/testimonialService';

const TestimonialForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    job: '',
    rating: 5,
    message: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await testimonialService.createTestimonial(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', job: '', rating: 5, message: '', imageUrl: '' });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={32}
        className={`star ${i < formData.rating ? 'active' : ''}`}
        onClick={() => setFormData({ ...formData, rating: i + 1 })}
        fill={i < formData.rating ? '#fbbf24' : 'none'}
        color={i < formData.rating ? '#fbbf24' : '#d1d5db'}
      />
    ));
  };

  if (submitted) {
    return (
      <div className="testimonial-success">
        <CheckCircle size={64} color="#10b981" />
        <h3>Merci pour votre témoignage !</h3>
        <p>Votre avis a été soumis avec succès. Il sera publié après validation par notre équipe.</p>
        <button onClick={() => setSubmitted(false)} className="btn-primary">
          Soumettre un autre avis
        </button>
      </div>
    );
  }

  return (
    <div className="testimonial-form-container">
      <div className="testimonial-form-header">
        <h2>Partagez votre expérience</h2>
        <p>Votre avis nous aide à nous améliorer et guide d'autres clients</p>
      </div>

      <form onSubmit={handleSubmit} className="testimonial-form">
        <div className="form-row">
          <div className="form-group">
            <label>Votre nom *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Ex: Jean Dupont"
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="votre@email.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Entreprise (optionnel)</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Nom de votre entreprise"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Métier / Profession (optionnel)</label>
            <input
              type="text"
              value={formData.job}
              onChange={(e) => setFormData({ ...formData, job: e.target.value })}
              placeholder="Ex: Architecte, Chef d'entreprise..."
            />
          </div>
          <div className="form-group">
            <label>Photo de profil - URL (optionnel)</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        {formData.imageUrl && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img 
              src={formData.imageUrl} 
              alt="Preview" 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }} 
              onError={(e) => e.target.style.display = 'none'} 
            />
          </div>
        )}

        <div className="form-group">
          <label>Votre note *</label>
          <div className="rating-stars">
            {renderStars()}
          </div>
        </div>

        <div className="form-group">
          <label>Votre témoignage *</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows="5"
            placeholder="Partagez votre expérience avec nos produits et services..."
          />
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <>
              <Loader2 size={20} className="spinner" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send size={20} />
              Envoyer mon témoignage
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TestimonialForm;
