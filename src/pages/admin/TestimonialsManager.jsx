import React, { useState, useEffect } from 'react';
import { Star, Check, X, Eye, EyeOff, Trash2, Loader2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import testimonialService from '../../services/testimonialService';

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, featured

  /* Removed API_URL and manual token handling */

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialService.getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApprove = async (id) => {
    try {
      await testimonialService.toggleApproval(id);
      fetchTestimonials();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const toggleFeature = async (id) => {
    try {
      await testimonialService.toggleFeatured(id);
      fetchTestimonials();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce témoignage ?')) {
      try {
        await testimonialService.deleteTestimonial(id);
        fetchTestimonials();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < rating ? '#fbbf24' : 'none'} 
        color={i < rating ? '#fbbf24' : '#d1d5db'} 
      />
    ));
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'pending') return !t.isApproved;
    if (filter === 'approved') return t.isApproved && !t.isFeatured;
    if (filter === 'featured') return t.isFeatured;
    return true;
  });

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => !t.isApproved).length,
    approved: testimonials.filter(t => t.isApproved && !t.isFeatured).length,
    featured: testimonials.filter(t => t.isFeatured).length,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 size={32} className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Gestion des Témoignages</h2>
          <p>Modérez et mettez en avant les avis clients</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card" onClick={() => setFilter('all')} style={{ cursor: 'pointer', background: filter === 'all' ? 'var(--color-accent)' : 'white', color: filter === 'all' ? 'white' : 'inherit' }}>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('pending')} style={{ cursor: 'pointer', background: filter === 'pending' ? '#f59e0b' : 'white', color: filter === 'pending' ? 'white' : 'inherit' }}>
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">En attente</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('approved')} style={{ cursor: 'pointer', background: filter === 'approved' ? '#10b981' : 'white', color: filter === 'approved' ? 'white' : 'inherit' }}>
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approuvés</div>
        </div>
        <div className="stat-card" onClick={() => setFilter('featured')} style={{ cursor: 'pointer', background: filter === 'featured' ? '#6366f1' : 'white', color: filter === 'featured' ? 'white' : 'inherit' }}>
          <div className="stat-number">{stats.featured}</div>
          <div className="stat-label">Mis en avant</div>
        </div>
      </div>

      {/* Testimonials List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        <AnimatePresence>
          {filteredTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                border: `2px solid ${testimonial.isFeatured ? '#6366f1' : testimonial.isApproved ? '#10b981' : '#f59e0b'}`,
                position: 'relative'
              }}
            >
              {/* Badges */}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                {testimonial.isFeatured && (
                  <span style={{ background: '#6366f1', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>
                    ⭐ Mis en avant
                  </span>
                )}
                {testimonial.isApproved && !testimonial.isFeatured && (
                  <span style={{ background: '#10b981', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>
                    ✓ Approuvé
                  </span>
                )}
                {!testimonial.isApproved && (
                  <span style={{ background: '#f59e0b', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600' }}>
                    ⏳ En attente
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{testimonial.name}</h3>
                  {testimonial.company && (
                    <span style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>• {testimonial.company}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.75rem' }}>
                  {renderStars(testimonial.rating)}
                </div>
                <p style={{ color: 'var(--color-text-light)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                  "{testimonial.message}"
                </p>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>
                  {testimonial.email} • {new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e5e5' }}>
                <button
                  onClick={() => toggleApprove(testimonial._id)}
                  className={testimonial.isApproved ? 'btn-secondary-admin' : 'btn-accent-admin'}
                  style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}
                >
                  {testimonial.isApproved ? (
                    <><X size={16} /> Désapprouver</>
                  ) : (
                    <><Check size={16} /> Approuver</>
                  )}
                </button>
                <button
                  onClick={() => toggleFeature(testimonial._id)}
                  className={testimonial.isFeatured ? 'btn-secondary-admin' : 'btn-primary-admin'}
                  style={{ flex: 1, fontSize: '0.875rem', padding: '0.5rem' }}
                >
                  {testimonial.isFeatured ? (
                    <><EyeOff size={16} /> Retirer</>
                  ) : (
                    <><Eye size={16} /> Mettre en avant</>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(testimonial._id)}
                  className="action-btn delete"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <MessageCircle size={32} />
          </div>
          <h3>Aucun témoignage</h3>
          <p>
            {filter === 'pending' && 'Aucun témoignage en attente de modération.'}
            {filter === 'approved' && 'Aucun témoignage approuvé.'}
            {filter === 'featured' && 'Aucun témoignage mis en avant.'}
            {filter === 'all' && 'Les clients pourront bientôt partager leurs avis.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
