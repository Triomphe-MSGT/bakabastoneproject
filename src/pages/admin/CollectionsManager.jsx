import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, X, Image as ImageIcon, Save, Loader2, Upload, Link, GripVertical, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import collectionService from '../../services/collectionService';
import uploadService from '../../services/uploadService';

const CollectionsManager = () => {
  const [collections, setCollections] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
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
    description: '',
    expertDescription: '',
    features: '',
    imageUrl: '',
    order: 0,
    isActive: true,
    pricePerM2: 0,
    isAvailable: true
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await collectionService.getAllCollections();
      // Handle both paginated and non-paginated responses
      if (data.collections) {
        setCollections(data.collections);
      } else {
        setCollections(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      setCollections([]);
    }
  };

  const BASE_URL = ''; // Kept for image display if needed, or move to config

  const uploadImage = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploading(true);
    try {
      const data = await uploadService.uploadFile(formDataUpload);
      // Backend now returns full Cloudinary URL in data.imageUrl
      return data.imageUrl;
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

      const collectionData = {
        ...formData,
        imageUrl: imageUrl,
        features: formData.features.split('\n').filter(f => f.trim() !== '')
      };

      if (isEditing) {
        await collectionService.updateCollection(currentCollection._id, collectionData);
      } else {
        await collectionService.createCollection(collectionData);
      }

      fetchCollections();
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette collection ?')) {
      try {
        await collectionService.deleteCollection(id);
        fetchCollections();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (collection) => {
    setFormData({
      name: collection.name,
      description: collection.description,
      expertDescription: collection.expertDescription || '',
      features: (collection.features || []).join('\n'),
      imageUrl: collection.imageUrl,
      order: collection.order,
      isActive: collection.isActive,
      pricePerM2: collection.pricePerM2 || 0,
      isAvailable: collection.isAvailable !== undefined ? collection.isAvailable : true
    });
    setPreviewUrl(collection.imageUrl);
    setUploadMode('url');
    setCurrentCollection(collection);
    setIsEditing(true);
    setShowForm(true);
  };

  const toggleActive = async (collection) => {
    try {
      await collectionService.updateCollection(collection._id, { ...collection, isActive: !collection.isActive });
      fetchCollections();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', expertDescription: '', features: '', imageUrl: '', order: 0, isActive: true });
    setIsEditing(false);
    setCurrentCollection(null);
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
      alert('Veuillez sélectionner une image valide');
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
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return BASE_URL + imageUrl;
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Collections de Pierres</h2>
          <p>Gérez vos catégories de pierres et leurs images</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-accent-admin">
          <Plus size={20} />
          Nouvelle Collection
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
                  {isEditing ? 'Modifier la collection' : 'Ajouter une collection'}
                </h3>
                <button onClick={resetForm} className="modal-close">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom de la collection</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Ex: Pierres Brutes"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Prix au m² (€)</label>
                    <input
                      type="number"
                      value={formData.pricePerM2}
                      onChange={(e) => setFormData({ ...formData, pricePerM2: parseFloat(e.target.value) || 0 })}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Disponibilité</label>
                    <select
                      value={formData.isAvailable ? 'available' : 'out'}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.value === 'available' })}
                      className="form-input form-select"
                    >
                      <option value="available">En stock</option>
                      <option value="out">Sur commande</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                    <label className="form-label">Statut Visibilité</label>
                    <select
                      value={formData.isActive ? 'active' : 'inactive'}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                      className="form-input form-select"
                    >
                      <option value="active">Actif (Visible)</option>
                      <option value="inactive">Inactif (Masqué)</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="form-group">
                  <label className="form-label">Image de la collection</label>
                  
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
                  <label className="form-label">Description courte</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-input form-textarea"
                    style={{ minHeight: '5rem' }}
                    placeholder="Brève description pour la liste des collections..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description d'expert (page de détail)</label>
                  <textarea
                    value={formData.expertDescription}
                    onChange={(e) => setFormData({ ...formData, expertDescription: e.target.value })}
                    className="form-input form-textarea"
                    style={{ minHeight: '8rem' }}
                    placeholder="Description détaillée par un expert géologue pour la page de détail..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Caractéristiques (une par ligne)</label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="form-input form-textarea"
                    style={{ minHeight: '6rem' }}
                    placeholder="Pierre 100% naturelle\nRésistance au gel\nGarantie 25 ans\n..."
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

      {/* Collections List */}
      <div className="projects-grid">
        <AnimatePresence>
          {collections.map((collection) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={collection._id}
              className="project-card"
              style={{ opacity: collection.isActive ? 1 : 0.6 }}
            >
              <div className="project-card-image">
                <img
                  src={getImageSrc(collection.imageUrl)}
                  alt={collection.name}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                />
                <div className="project-card-overlay" />
                
                {/* Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: collection.isActive ? '#10b981' : '#6b7280',
                  color: 'white'
                }}>
                  {collection.isActive ? 'Actif' : 'Inactif'}
                </div>
                
                <div className="project-card-actions">
                  <button
                    onClick={() => toggleActive(collection)}
                    className="action-btn"
                    style={{ color: collection.isActive ? '#6b7280' : '#10b981' }}
                    title={collection.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {collection.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => handleEdit(collection)}
                    className="action-btn edit"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(collection._id)}
                    className="action-btn delete"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="project-card-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="project-category">Ordre: {collection.order}</span>
                </div>
                <h3 className="project-title">{collection.name}</h3>
                <p className="project-description">{collection.description}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {collections.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ImageIcon size={32} />
          </div>
          <h3 className="empty-state-title">Aucune collection</h3>
          <p className="empty-state-description">Commencez par ajouter votre première collection de pierres.</p>
          <button onClick={() => setShowForm(true)} className="empty-state-link">
            Créer une collection maintenant
          </button>
        </div>
      )}
    </div>
  );
};

export default CollectionsManager;
