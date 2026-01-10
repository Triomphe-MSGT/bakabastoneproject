import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
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
              Expertise et passion de la pierre naturelle. 
              Vente, pose, décoration et rénovation pour tous vos projets d'aménagement.
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
                <span>Axe N3, Pouma, Cameroun</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+237 6 98 94 30 52</span>
              </li>
              <li>
                <Mail size={18} />
                <span>alainbakaba7@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="footer-col">
            <h4 className="footer-heading">Suivez-nous</h4>
            <div className="footer-social">
              <a href="https://www.facebook.com/share/1E6ad1N8mt/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={24} /></a>
              {/* <a href="#" aria-label="Instagram"><Instagram size={24} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={24} /></a> */}
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
