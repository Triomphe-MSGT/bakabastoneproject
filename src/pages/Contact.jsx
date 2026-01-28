import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import TestimonialForm from '../components/TestimonialForm';
import './Contact.css';
import messageService from '../services/messageService';
import settingsService from '../services/settingsService';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    contactEmail: 'contact@sitevitrine.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Pierre, 75001 Paris',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Error fetching settings for contact:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
// ... existing handleSubmit ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await messageService.createMessage(formData);

      setStatus({
        type: 'success',
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || "Impossible d'envoyer le message. Veuillez réessayer."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">Contactez-nous</h1>
          <p className="page-subtitle">Discutons de votre projet et donnons vie à vos idées.</p>
        </div>
      </div>

      <Section>
        <div className="contact-wrapper">
          <div className="contact-info">
            <h2>Informations</h2>
            <p className="contact-intro">
              Notre équipe est à votre disposition pour répondre à toutes vos questions 
              concernant nos produits et services.
            </p>
            
            <ul className="info-list">
              <li>
                <div className="info-icon"><MapPin size={20} /></div>
                <div>
                  <h4>Adresse</h4>
                  <p>{settings.address}</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><Phone size={20} /></div>
                <div>
                  <h4>Téléphone</h4>
                  <p>{settings.phone}</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><Mail size={20} /></div>
                <div>
                  <h4>Email</h4>
                  <p>{settings.contactEmail}</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><Clock size={20} /></div>
                <div>
                  <h4>Horaires</h4>
                  <p>{settings.workingHours || 'Lun - Ven: 9h00 - 18h00 | Sam: 10h00 - 16h00'}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
            
            {status.message && (
              <div 
                className={`status-message ${status.type}`}
                style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: status.type === 'success' ? '#166534' : '#991b1b',
                  fontSize: '0.9rem',
                  border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                }}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nom complet</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="Demande de devis">Demande de devis</option>
                  <option value="Renseignements produits">Renseignements produits</option>
                  <option value="Partenariat">Partenariat</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  disabled={loading}
                ></textarea>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>
            </form>
          </div>
        </div>
      </Section>

      {/* Testimonial Form Section */}
      <Section bgColor="#f9fafb">
        <TestimonialForm />
      </Section>
    </div>
  );
};

export default Contact;
