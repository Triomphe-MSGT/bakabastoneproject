import React, { useState, useEffect } from 'react';
import { Star, MessageSquareQuote, X } from 'lucide-react';
import './FloatingTestimonials.css';

import testimonialService from '../../services/testimonialService';

const FloatingTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fallback data in case API is empty or fails (to ensure "Always displays" request is met for demo)
  const fallbackTestimonials = [
    {
      _id: '1',
      name: 'Jean Michel',
      job: 'Architecte',
      message: 'Une qualité de pierre exceptionnelle et un service irréprochable. Je recommande vivement pour tout projet de construction.',
      rating: 5
    },
    {
      _id: '2',
      name: 'Sophie Dubois',
      job: 'Propriétaire',
      message: 'Ma terrasse est magnifique grâce à vos conseils. Le rendu est au-delà de mes espérances.',
      rating: 5
    },
    {
      _id: '3',
      name: 'Marc Lefebvre',
      job: 'Entreprise BTP',
      message: 'Partenaire fiable depuis 3 ans. Délais respectés et matériaux conformes. Un vrai plaisir de travailler ensemble.',
      rating: 4
    }
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await testimonialService.getFeaturedTestimonials();
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, [testimonials]);

  if (!isVisible || (testimonials.length === 0 && !loading)) return null;

  const currentTestimonial = testimonials[currentIndex];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        fill={i < rating ? "#fbbf24" : "none"} 
        stroke={i < rating ? "#fbbf24" : "#cbd5e1"}
      />
    ));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="floating-testimonials-container">
      {loading ? (
        <div className="testimonial-card-wrapper">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      ) : (
        <div className="testimonial-card-wrapper" key={currentIndex}>
          <div className="testimonial-header">
            <div className="testimonial-label">
              <MessageSquareQuote size={16} />
              Avis Clients
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0 }}
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="testimonial-content fade-enter">
            <p className="testimonial-quote">
              "{currentTestimonial.message}"
            </p>
            
            <div className="testimonial-author">
              <div className="author-avatar">
                {currentTestimonial.imageUrl ? (
                  <img src={currentTestimonial.imageUrl} alt={currentTestimonial.name} />
                ) : (
                  getInitials(currentTestimonial.name)
                )}
              </div>
              <div className="author-info">
                <span className="author-name">{currentTestimonial.name}</span>
                {currentTestimonial.job && (
                  <span className="author-role">{currentTestimonial.job}</span>
                )}
              </div>
              <div className="testimonial-stars">
                {renderStars(currentTestimonial.rating)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingTestimonials;
