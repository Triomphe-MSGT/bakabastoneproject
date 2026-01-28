import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save, Loader2, Eye, EyeOff, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import expertiseService from '../../services/expertiseService';

const ExpertiseManager = () => {
  const [expertises, setExpertises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpertise, setCurrentExpertise] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '01',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchExpertises();
  }, []);

  const fetchExpertises = async () => {
    try {
      const data = await expertiseService.getAllExpertise();
      setExpertises(data);
    } catch (error) {
      console.error('Erreur lors du chargement des expertises:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing) {
        await expertiseService.updateExpertise(currentExpertise._id, formData);
      } else {
        await expertiseService.createExpertise(formData);
      }
      fetchExpertises();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette expertise ?')) {
      try {
        await expertiseService.deleteExpertise(id);
        fetchExpertises();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (expertise) => {
    setFormData({
      title: expertise.title,
      description: expertise.description,
      icon: expertise.icon,
      order: expertise.order,
      isActive: expertise.isActive
    });
    setCurrentExpertise(expertise);
    setIsEditing(true);
    setShowForm(true);
  };

  const toggleActive = async (expertise) => {
    try {
      await expertiseService.updateExpertise(expertise._id, { ...expertise, isActive: !expertise.isActive });
      fetchExpertises();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', icon: '01', order: 0, isActive: true });
    setIsEditing(false);
    setCurrentExpertise(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Gestion de l'Expertise</h2>
          <p>Gérez les services et compétences affichés sur la page d'accueil</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-accent-admin">
          <Plus size={20} />
          Nouvelle Expertise
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="modal-backdrop" onClick={resetForm}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3 className="modal-title">
                  {isEditing ? 'Modifier l\'expertise' : 'Ajouter une expertise'}
                </h3>
                <button onClick={resetForm} className="modal-close">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Ex: Vente de Matériaux"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Numéro/Icône</label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="form-input"
                      placeholder="01"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ordre</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Statut</label>
                    <select
                      value={formData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                      className="form-input form-select"
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input form-textarea"
                    placeholder="Décrivez ce service..."
                    required
                  />
                </div>

                <div className="modal-footer" style={{ padding: '0', border: 'none', marginTop: '1rem' }}>
                  <button type="button" onClick={resetForm} className="btn-secondary-admin">
                    Annuler
                  </button>
                  <button type="submit" disabled={loading} className="btn-accent-admin">
                    {loading ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        Sauvegarde...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expertise List */}
      <div className="projects-grid">
        <AnimatePresence>
          {expertises.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item._id}
              className="project-card"
              style={{ opacity: item.isActive ? 1 : 0.6 }}
            >
              <div style={{ 
                padding: '2rem', 
                backgroundColor: 'var(--color-surface)',
                borderBottom: '1px solid #e5e5e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '150px'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '700',
                  color: 'rgba(204, 163, 94, 0.2)',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {item.icon}
                </div>
                
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: item.isActive ? '#10b981' : '#6b7280',
                  color: 'white'
                }}>
                  {item.isActive ? 'Actif' : 'Inactif'}
                </div>
                
                <div className="project-card-actions">
                  <button
                    onClick={() => toggleActive(item)}
                    className="action-btn"
                    style={{ color: item.isActive ? '#6b7280' : '#10b981' }}
                    title={item.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {item.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="action-btn edit"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="action-btn delete"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="project-card-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="project-category">Ordre: {item.order}</span>
                </div>
                <h3 className="project-title">{item.title}</h3>
                <p className="project-description">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {expertises.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Award size={32} />
          </div>
          <h3 className="empty-state-title">Aucune expertise</h3>
          <p className="empty-state-description">Commencez par ajouter vos services.</p>
          <button onClick={() => setShowForm(true)} className="empty-state-link">
            Créer une expertise maintenant
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertiseManager;
