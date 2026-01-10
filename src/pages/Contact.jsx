import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Section from '../components/ui/Section';
import Button from '../components/ui/Button';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    alert('Merci pour votre message. Nous vous contacterons bientôt.');
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
                  <p>Axe N3, Pouma, Cameroun</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><Phone size={20} /></div>
                <div>
                  <h4>Téléphone</h4>
                  <p>+237 6 98 94 30 52</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><Mail size={20} /></div>
                <div>
                  <h4>Email</h4>
                  <p>alainbakaba7@gmail.com</p>
                </div>
              </li>
              <li>
                <div className="info-icon"><Clock size={20} /></div>
                <div>
                  <h4>Horaires</h4>
                  <p>Lun - Ven: 9h00 - 18h00<br />Sam: 10h00 - 16h00</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact-form-container">
            <h2>Envoyez-nous un message</h2>
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
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <select 
                  id="subject" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="devis">Demande de devis</option>
                  <option value="info">Renseignements produits</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="autre">Autre</option>
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
                ></textarea>
              </div>
              <Button type="submit">Envoyer le message</Button>
            </form>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
