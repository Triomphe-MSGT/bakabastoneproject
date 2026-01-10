import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Save, Loader2, Upload, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Général',
    materials: ''
  });

  const API_URL = 'http://localhost:5000/api/projects';
  const UPLOAD_URL = 'http://localhost:5000/api/upload';
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    }
  };

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploading(true);
    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      return BASE_URL + data.imageUrl;
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors du téléversement: ' + error.message);
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

      // If there's a file to upload, upload it first
      if (uploadMode === 'file' && selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      const projectData = {
        ...formData,
        imageUrl: imageUrl,
        materials: formData.materials.split('\n').filter(m => m.trim() !== '')
      };

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/${currentProject._id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        fetchProjects();
        resetForm();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        fetchProjects();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      category: project.category,
      materials: (project.materials || []).join('\n')
    });
    setPreviewUrl(project.imageUrl);
    setUploadMode('url');
    setCurrentProject(project);
    setIsEditing(true);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', imageUrl: '', category: 'Général', materials: '' });
    setIsEditing(false);
    setCurrentProject(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadMode('file');
  };

  // File handling
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData({ ...formData, imageUrl: '' });
    } else {
      alert('Veuillez sélectionner une image valide (JPG, PNG, GIF, WEBP)');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const getImageSrc = (imageUrl) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return BASE_URL + imageUrl;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Gestion des Projets</h2>
          <p>Gérez votre portfolio et vos réalisations</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-accent-admin">
          <Plus size={20} />
          Nouveau Projet
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
              style={{ maxWidth: '36rem' }}
            >
              <div className="modal-header">
                <h3 className="modal-title">
                  {isEditing ? 'Modifier le projet' : 'Ajouter un projet'}
                </h3>
                <button onClick={resetForm} className="modal-close">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Titre du projet</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Ex: Villa Moderne"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input form-select"
                  >
                    <option value="Général">Général</option>
                    <option value="Résidentiel">Résidentiel</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Urbain">Urbain</option>
                    <option value="Paysager">Paysager</option>
                  </select>
                </div>

                {/* Image Upload Section */}
                <div className="form-group">
                  <label className="form-label">Image du projet</label>
                  
                  {/* Toggle between upload and URL */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={uploadMode === 'file' ? 'btn-accent-admin' : 'btn-secondary-admin'}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                    >
                      <Upload size={16} style={{ marginRight: '0.5rem' }} />
                      Téléverser
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={uploadMode === 'url' ? 'btn-accent-admin' : 'btn-secondary-admin'}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                    >
                      <Link size={16} style={{ marginRight: '0.5rem' }} />
                      URL
                    </button>
                  </div>

                  {uploadMode === 'file' ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: `2px dashed ${dragActive ? 'var(--color-accent, #cca35e)' : '#e5e5e5'}`,
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: dragActive ? 'rgba(204, 163, 94, 0.05)' : '#fafafa',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                      />
                      
                      {previewUrl && uploadMode === 'file' ? (
                        <div style={{ position: 'relative' }}>
                          <img
                            src={previewUrl}
                            alt="Preview"
                            style={{
                              maxHeight: '10rem',
                              maxWidth: '100%',
                              objectFit: 'contain',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFile(null);
                              setPreviewUrl('');
                            }}
                            style={{
                              position: 'absolute',
                              top: '-0.5rem',
                              right: '-0.5rem',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '1.5rem',
                              height: '1.5rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <X size={14} />
                          </button>
                          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
                            {selectedFile?.name}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} style={{ color: 'var(--color-secondary)', marginBottom: '0.5rem' }} />
                          <p style={{ color: 'var(--color-text)', fontWeight: '500', marginBottom: '0.25rem' }}>
                            Glissez-déposez une image ici
                          </p>
                          <p style={{ color: 'var(--color-secondary)', fontSize: '0.875rem' }}>
                            ou cliquez pour parcourir
                          </p>
                          <p style={{ color: 'var(--color-secondary)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            JPG, PNG, GIF, WEBP • Max 5MB
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="input-with-icon">
                        <div className="input-icon-wrapper">
                          <ImageIcon size={18} />
                        </div>
                        <input
                          type="text"
                          value={formData.imageUrl}
                          onChange={(e) => {
                            setFormData({ ...formData, imageUrl: e.target.value });
                            setPreviewUrl(e.target.value);
                          }}
                          placeholder="https://exemple.com/image.jpg"
                        />
                      </div>
                      {previewUrl && (
                        <div style={{ marginTop: '0.75rem', height: '8rem', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e5e5e5' }}>
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => e.target.style.display = 'none'} 
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input form-textarea"
                    placeholder="Décrivez votre projet..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Matériaux utilisés (un par ligne)</label>
                  <textarea
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    className="form-input form-textarea"
                    style={{ minHeight: '6rem' }}
                    placeholder="Marbre de Carrare\nGranit Noir\n..."
                  />
                </div>

                <div className="modal-footer" style={{ padding: '0', border: 'none', marginTop: '1rem' }}>
                  <button type="button" onClick={resetForm} className="btn-secondary-admin">
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || uploading || (uploadMode === 'file' && !selectedFile && !isEditing) || (uploadMode === 'url' && !formData.imageUrl)} 
                    className="btn-accent-admin"
                  >
                    {loading || uploading ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        {uploading ? 'Téléversement...' : 'Sauvegarde...'}
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

      {/* Projects List */}
      <div className="projects-grid">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={project._id}
              className="project-card"
            >
              <div className="project-card-image">
                <img
                  src={getImageSrc(project.imageUrl)}
                  alt={project.title}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                />
                <div className="project-card-overlay" />
                
                <div className="project-card-actions">
                  <button
                    onClick={() => handleEdit(project)}
                    className="action-btn edit"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="action-btn delete"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="project-card-content">
                <span className="project-category">{project.category}</span>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ImageIcon size={32} />
          </div>
          <h3 className="empty-state-title">Aucun projet</h3>
          <p className="empty-state-description">Commencez par ajouter votre première réalisation.</p>
          <button onClick={() => setShowForm(true)} className="empty-state-link">
            Créer un projet maintenant
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
