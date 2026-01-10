import React, { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, Search, Filter, X, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    // Simulated messages - replace with actual API call
    setMessages([
      {
        id: 1,
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        subject: 'Demande de devis pour projet résidentiel',
        message: 'Bonjour, je souhaiterais obtenir un devis pour la rénovation de ma terrasse en pierre naturelle. Le projet concerne environ 50m² de surface. Pourriez-vous me contacter pour en discuter ?',
        date: '2026-01-04T10:30:00',
        read: false
      },
      {
        id: 2,
        name: 'Marie Martin',
        email: 'marie.martin@entreprise.fr',
        subject: 'Partenariat commercial',
        message: 'Madame, Monsieur, notre entreprise est intéressée par un partenariat avec votre société pour nos projets immobiliers. Nous aimerions organiser une réunion.',
        date: '2026-01-03T15:45:00',
        read: true
      },
      {
        id: 3,
        name: 'Pierre Lambert',
        email: 'p.lambert@gmail.com',
        subject: 'Question sur les matériaux',
        message: 'Bonjour, je voudrais savoir quels types de pierres vous proposez pour un projet de façade. Avez-vous un catalogue ?',
        date: '2026-01-02T09:00:00',
        read: true
      }
    ]);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Hier';
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return date.toLocaleDateString('fr-FR');
    }
  };

  const markAsRead = (id) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, read: true } : m
    ));
  };

  const deleteMessage = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !m.read) ||
                         (filter === 'read' && m.read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Messages</h2>
          <p>Gérez les messages reçus via le formulaire de contact</p>
        </div>
        {unreadCount > 0 && (
          <span className="project-category">
            {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Search & Filter */}
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div className="admin-card-body" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="input-with-icon" style={{ flex: '1', minWidth: '250px' }}>
              <div className="input-icon-wrapper">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Rechercher un message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'unread', 'read'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={filter === f ? 'btn-accent-admin' : 'btn-secondary-admin'}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  {f === 'all' ? 'Tous' : f === 'unread' ? 'Non lus' : 'Lus'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="message-list">
        <AnimatePresence>
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`message-item ${!message.read ? 'unread' : ''}`}
            >
              <div className="message-header">
                <div>
                  <div className="message-sender">{message.name}</div>
                  <div className="message-email">{message.email}</div>
                </div>
                <div className="message-date">
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {formatDate(message.date)}
                </div>
              </div>
              
              <div className="message-subject">{message.subject}</div>
              <p className="message-preview">{message.message}</p>
              
              <div className="message-actions">
                <button 
                  className="btn-primary-admin"
                  onClick={() => {
                    setSelectedMessage(message);
                    markAsRead(message.id);
                  }}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Eye size={16} />
                  Voir
                </button>
                <button 
                  className="btn-secondary-admin"
                  onClick={() => deleteMessage(message.id)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: '#e57373' }}
                >
                  <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
                  Supprimer
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMessages.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Mail size={32} />
          </div>
          <h3 className="empty-state-title">Aucun message</h3>
          <p className="empty-state-description">
            {searchTerm || filter !== 'all' 
              ? 'Aucun message ne correspond à vos critères.' 
              : 'Vous n\'avez pas encore reçu de messages.'}
          </p>
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="modal-backdrop" onClick={() => setSelectedMessage(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '40rem' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Message de {selectedMessage.name}</h3>
                <button className="modal-close" onClick={() => setSelectedMessage(null)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e5e5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.875rem' }}>
                    <User size={14} style={{ marginRight: '0.5rem' }} />
                    {selectedMessage.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.875rem' }}>
                    <Mail size={14} style={{ marginRight: '0.5rem' }} />
                    <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--color-accent)' }}>
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-secondary)', fontSize: '0.875rem' }}>
                    <Clock size={14} style={{ marginRight: '0.5rem' }} />
                    {new Date(selectedMessage.date).toLocaleString('fr-FR')}
                  </div>
                </div>
                
                <h4 style={{ fontWeight: '600', color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  {selectedMessage.subject}
                </h4>
                
                <p style={{ color: 'var(--color-text)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {selectedMessage.message}
                </p>
              </div>
              
              <div className="modal-footer">
                <button className="btn-secondary-admin" onClick={() => setSelectedMessage(null)}>
                  Fermer
                </button>
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="btn-accent-admin"
                >
                  <Mail size={16} />
                  Répondre
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagesManager;
