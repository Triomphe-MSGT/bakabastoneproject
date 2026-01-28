import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Music } from 'lucide-react';
import './Footer.css';
import settingsService from '../../services/settingsService';

const Footer = () => {
  const [settings, setSettings] = useState({
    contactEmail: 'contact@sitevitrine.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Pierre, 75001 Paris',
    siteDescription: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    telegramUrl: '',
  });



  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Error fetching settings for footer:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col">
            <Link to="/" className="footer-logo">
              <img src="/logo.png" alt="Stone Bakaba Decoration" style={{ height: '80px', width: 'auto', objectFit: 'contain', marginBottom: '1rem' }} />
            </Link>
            <p className="footer-desc">
              {settings.siteDescription || `Expertise et passion de la pierre naturelle. Vente, pose, décoration et rénovation pour tous vos projets d'aménagement.`}
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/products">Nos Pierres</Link></li>
              <li><Link to="/portfolio">Réalisations</Link></li>
              <li><Link to="/about">L'Entreprise</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-col">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>{settings.address}</span>
              </li>
              <li>
                <Phone size={18} />
                <span>{settings.phone}</span>
              </li>
              <li>
                <Mail size={18} />
                <span>{settings.contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-col">
            <h4 className="footer-heading">Suivez-nous</h4>
            <div className="footer-social">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={24} />
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={24} />
                </a>
              )}
              {settings.tiktokUrl && (
                <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <Music size={24} />
                </a>
              )}
              {settings.telegramUrl && (
                <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <Send size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lithos. Tous droits réservés.</p>
          <div className="footer-legal">
            <Link to="/legal">Mentions Légales</Link>
            <Link to="/privacy">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
