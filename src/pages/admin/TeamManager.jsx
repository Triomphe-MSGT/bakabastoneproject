import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Save, Loader2, Upload, Link, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import teamService from '../../services/teamService';
import uploadService from '../../services/uploadService';

const TeamManager = () => {
  const [team, setTeam] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('file');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    order: 0
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const data = await teamService.getAllTeamMembers();
      setTeam(data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'équipe:', error);
    }
  };

  const BASE_URL = 'http://localhost:5000';

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploading(true);
    try {
      const data = await uploadService.uploadFile(formDataUpload);
      return BASE_URL + data.imageUrl;
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors du téléversement');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = formData.imageUrl;

      if (uploadMode === 'file' && selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const memberData = {
        ...formData,
        imageUrl: imageUrl
      };

      if (isEditing) {
        await teamService.updateTeamMember(currentMember._id, memberData);
      } else {
        await teamService.createTeamMember(memberData);
      }

      fetchTeam();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce membre de l\'équipe ?')) {
      try {
        await teamService.deleteTeamMember(id);
        fetchTeam();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (member) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      imageUrl: member.imageUrl || '',
      order: member.order || 0
    });
    setPreviewUrl(member.imageUrl);
    setUploadMode(member.imageUrl?.startsWith('http') ? 'url' : 'file');
    setCurrentMember(member);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', imageUrl: '', order: 0 });
    setIsEditing(false);
    setCurrentMember(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadMode('file');
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/150?text=Utilisateur';
    if (imageUrl.startsWith('http')) return imageUrl;
    return BASE_URL + imageUrl;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Gestion de l'Équipe</h2>
          <p>Présentez les experts qui font la force de votre entreprise</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-accent-admin">
          <Plus size={20} />
          Nouveau Membre
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="modal-backdrop" onClick={resetForm}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '36rem' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">
                  {isEditing ? 'Modifier le profil' : 'Ajouter un membre'}
                </h3>
                <button onClick={resetForm} className="modal-close"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nom Complet</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="Ex: Alain Bakaba"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Poste / Rôle</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="form-input"
                      placeholder="Ex: Expert Géologue"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Ordre d'affichage</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="form-input"
                      min="0"
                    />
                </div>

                <div className="form-group">
                  <label className="form-label">Photo de profil</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button type="button" onClick={() => setUploadMode('file')} className={uploadMode === 'file' ? 'btn-accent-admin' : 'btn-secondary-admin'} style={{ flex: 1, padding: '0.5rem' }}>
                      <Upload size={16} /> Téléverser
                    </button>
                    <button type="button" onClick={() => setUploadMode('url')} className={uploadMode === 'url' ? 'btn-accent-admin' : 'btn-secondary-admin'} style={{ flex: 1, padding: '0.5rem' }}>
                      <Link size={16} /> URL
                    </button>
                  </div>

                  {uploadMode === 'file' ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ border: '2px dashed #e5e5e5', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fafafa' }}
                    >
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e.target.files[0])} style={{ display: 'none' }} />
                      {previewUrl && uploadMode === 'file' ? (
                        <img src={previewUrl} alt="Preview" style={{ maxHeight: '8rem', borderRadius: '0.5rem' }} />
                      ) : (
                        <p>Cliquez pour choisir une photo</p>
                      )}
                    </div>
                  ) : (
                    <input type="text" value={formData.imageUrl} onChange={(e) => { setFormData({ ...formData, imageUrl: e.target.value }); setPreviewUrl(e.target.value); }} className="form-input" placeholder="Lien de l'image..." />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Bio (optionnel)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="form-input form-textarea"
                    placeholder="Une courte phrase de présentation..."
                  />
                </div>

                <div className="modal-footer" style={{ padding: '0', border: 'none', marginTop: '1rem' }}>
                  <button type="button" onClick={resetForm} className="btn-secondary-admin">Annuler</button>
                  <button type="submit" disabled={loading || uploading} className="btn-accent-admin">
                    {loading ? <Loader2 size={18} className="spinner" /> : <Save size={18} />} Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="projects-grid">
        {team.map((member) => (
          <div key={member._id} className="project-card">
            <div className="project-card-image" style={{ height: '250px' }}>
              <img src={getImageSrc(member.imageUrl)} alt={member.name} style={{ height: '100%', objectFit: 'cover' }} />
              <div className="project-card-actions">
                <button onClick={() => handleEdit(member)} className="action-btn edit"><Edit size={18} /></button>
                <button onClick={() => handleDelete(member._id)} className="action-btn delete"><Trash2 size={18} /></button>
              </div>
            </div>
            <div className="project-card-content">
              <span className="project-category">{member.role}</span>
              <h3 className="project-title">{member.name}</h3>
              <p className="project-description">{member.bio || 'Aucune biographie fournie.'}</p>
            </div>
          </div>
        ))}
      </div>
      
      {team.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon"><User size={32} /></div>
          <h3>Aucun membre d'équipe</h3>
          <p>Commencez par présenter les visages de votre entreprise.</p>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
