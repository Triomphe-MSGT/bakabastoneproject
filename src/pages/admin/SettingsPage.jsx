import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, User, Lock, Bell, Palette, Globe, Shield, Loader2, 
  AlertCircle, CheckCircle, MessageCircle, Instagram, Facebook, Send, Music, Share2, Award, Image as ImageIcon, Upload, Link as LinkIcon, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import settingsService from '../../services/settingsService';
import authService from '../../services/authService';
import uploadService from '../../services/uploadService';

const SettingsPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadMode, setUploadMode] = useState('url');
  const [selectedAboutImage, setSelectedAboutImage] = useState(null);
  const [previewAboutUrl, setPreviewAboutUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const [settings, setSettings] = useState({
    siteName: 'Site Vitrine',
    siteDescription: 'Entreprise de vente et promotion de pierres naturelles',
    contactEmail: 'contact@sitevitrine.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Pierre, 75001 Paris',
    workingHours: '', 
    whatsappNumber: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    telegramUrl: '',
    aboutImageUrl: '',
    aboutText: '',
    username: '',
    notifications: {
      email: true,
      newMessage: true,
      weeklyReport: false
    },
    appearance: {
      darkMode: false,
      compactMode: false
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        
        setSettings(prev => ({
          ...prev,
          ...data,
          notifications: { ...prev.notifications, ...data.notifications },
          appearance: { ...prev.appearance, ...data.appearance }
        }));
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();

    if (user) {
      setSettings(prev => ({
        ...prev,
        username: user.username || ''
      }));
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleAboutImageSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedAboutImage(file);
      setPreviewAboutUrl(URL.createObjectURL(file));
      setSettings({ ...settings, aboutImageUrl: '' });
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
      handleAboutImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleAboutImageSelect(e.target.files[0]);
    }
  };

  const uploadAboutImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const data = await uploadService.uploadFile(formData);
      // Assuming backend returns relative path, prepend base URL if needed or handle in service
      // Service returns data object directly.
      return 'http://localhost:5000' + data.imageUrl;
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors du téléversement');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Upload image if needed
      let aboutImageUrl = settings.aboutImageUrl;
      if (uploadMode === 'file' && selectedAboutImage) {
        const uploadedUrl = await uploadAboutImage(selectedAboutImage);
        if (!uploadedUrl) {
          setLoading(false);
          return;
        }
        aboutImageUrl = uploadedUrl;
      }

      // 1. Update Profile (Username)
      if (settings.username !== user.username) {
        const data = await authService.updateProfile({ username: settings.username });

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo.username = data.username;
        // token might not change on profile update, but if it does, handle it.
        if (data.token) userInfo.token = data.token;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }

      // 2. Save Site Settings
      await settingsService.updateSettings({
          siteName: settings.siteName,
          siteDescription: settings.siteDescription,
          contactEmail: settings.contactEmail,
          phone: settings.phone,
          address: settings.address,
          workingHours: settings.workingHours,
          whatsappNumber: settings.whatsappNumber,
          facebookUrl: settings.facebookUrl,
          instagramUrl: settings.instagramUrl,
          tiktokUrl: settings.tiktokUrl,
          telegramUrl: settings.telegramUrl,
          aboutImageUrl: aboutImageUrl,
          aboutText: settings.aboutText,
          notifications: settings.notifications,
          appearance: settings.appearance
      });

      showMessage('success', 'Paramètres sauvegardés avec succès !');
      
      // Clear upload state
      setSelectedAboutImage(null);
      setPreviewAboutUrl('');
      
      if (settings.username !== user.username) {
          setTimeout(() => window.location.reload(), 1500);
      }

    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Les mots de passe ne correspondent pas.');
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await authService.updatePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
      });

      showMessage('success', 'Mot de passe modifié avec succès !');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const ToggleSwitch = ({ active, onChange }) => (
    <div 
      className={`toggle-switch ${active ? 'active' : ''}`}
      onClick={onChange}
    />
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <h2>Paramètres</h2>
          <p>Configurez les options de votre espace d'administration</p>
        </div>
        <button className="btn-accent-admin" onClick={handleSave} disabled={loading || uploading}>
          {loading || uploading ? (
            <>
              <Loader2 size={18} className="spinner" />
              {uploading ? 'Téléversement...' : 'Sauvegarde...'}
            </>
          ) : (
            <>
              <Save size={18} />
              Sauvegarder
            </>
          )}
        </button>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: message.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <User size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Profil Administrateur
            </h3>
            <p className="settings-section-description">Gérez vos informations personnelles</p>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="form-group">
            <label className="form-label">Nom d'utilisateur</label>
            <input
              type="text"
              className="form-input"
              value={settings.username || ''}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <Globe size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Informations du Site
            </h3>
            <p className="settings-section-description">Paramètres visibles sur le site public</p>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="form-group">
            <label className="form-label">Nom du site</label>
            <input
              type="text"
              className="form-input"
              value={settings.siteName || ''}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description (Générale / Footer)</label>
            <textarea
              className="form-input form-textarea"
              value={settings.siteDescription || ''}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email de contact</label>
              <input
                type="email"
                className="form-input"
                value={settings.contactEmail || ''}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                className="form-input"
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">WhatsApp (N° avec indicatif)</label>
              <div className="input-with-icon" style={{ background: '#fafafa' }}>
                <div className="input-icon-wrapper">
                  <MessageCircle size={18} color="#25D366" />
                </div>
                <input
                  type="text"
                  placeholder="Ex: 237698943052"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Horaires d'ouverture</label>
              <input
                type="text"
                className="form-input"
                value={settings.workingHours || ''}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                placeholder="Ex: Lun - Ven: 9h00 - 18h00"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Adresse</label>
            <input
              type="text"
              className="form-input"
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Presentation Settings (About Page) */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <Award size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Présentation (Page À Propos)
            </h3>
            <p className="settings-section-description">Gérez le contenu de la section "Excellence et Passion"</p>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="form-group">
            <label className="form-label">Texte de présentation</label>
            <textarea
              className="form-input form-textarea"
              style={{ minHeight: '150px' }}
              value={settings.aboutText || ''}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
              placeholder="Décrivez l'histoire et les valeurs de votre entreprise..."
            />
          </div>
          <div className="form-group">
            <label className="form-label">Image de présentation</label>
            
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
                <LinkIcon size={16} style={{ marginRight: '0.5rem' }} />
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
                
                {previewAboutUrl && uploadMode === 'file' ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={previewAboutUrl}
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
                        setSelectedAboutImage(null);
                        setPreviewAboutUrl('');
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
                      {selectedAboutImage?.name}
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
                  <div className="input-icon-wrapper"><ImageIcon size={18} /></div>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={settings.aboutImageUrl || ''} 
                    onChange={(e) => {
                      setSettings({...settings, aboutImageUrl: e.target.value});
                      setPreviewAboutUrl(e.target.value);
                    }}
                    placeholder="https://..."
                  />
                </div>
                {(previewAboutUrl || settings.aboutImageUrl) && (
                  <div style={{ marginTop: '1rem', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img 
                      src={previewAboutUrl || settings.aboutImageUrl} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => e.target.style.display = 'none'} 
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Settings */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <Share2 size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Réseaux Sociaux
            </h3>
            <p className="settings-section-description">Lien vers vos profils sociaux (laisser vide pour masquer)</p>
          </div>
        </div>
        <div className="settings-section-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Facebook</label>
              <div className="input-with-icon">
                <div className="input-icon-wrapper"><Facebook size={18} color="#1877F2" /></div>
                <input 
                  type="url" 
                  className="form-input" 
                  value={settings.facebookUrl || ''} 
                  onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})}
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <div className="input-with-icon">
                <div className="input-icon-wrapper"><Instagram size={18} color="#E4405F" /></div>
                <input 
                  type="url" 
                  className="form-input" 
                  value={settings.instagramUrl || ''} 
                  onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">TikTok</label>
              <div className="input-with-icon">
                <div className="input-icon-wrapper"><Music size={18} color="#000000" /></div>
                <input 
                  type="url" 
                  className="form-input" 
                  value={settings.tiktokUrl || ''} 
                  onChange={(e) => setSettings({...settings, tiktokUrl: e.target.value})}
                  placeholder="https://tiktok.com/@..."
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Telegram</label>
              <div className="input-with-icon">
                <div className="input-icon-wrapper"><Send size={18} color="#0088cc" /></div>
                <input 
                  type="url" 
                  className="form-input" 
                  value={settings.telegramUrl || ''} 
                  onChange={(e) => setSettings({...settings, telegramUrl: e.target.value})}
                  placeholder="https://t.me/..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <Shield size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Sécurité
            </h3>
            <p className="settings-section-description">Modifiez votre mot de passe</p>
          </div>
        </div>
        <div className="settings-section-body">
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Mot de passe actuel</label>
              <input
                type="password"
                className="form-input"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary-admin" style={{ marginTop: '0.5rem' }} disabled={loading}>
              <Lock size={16} />
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <Bell size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Notifications
            </h3>
            <p className="settings-section-description">Gérez vos préférences de notifications</p>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="settings-row">
            <div>
              <div className="settings-label">Notifications par email</div>
              <div className="settings-description">Recevez des emails pour les événements importants</div>
            </div>
            <ToggleSwitch 
              active={settings.notifications.email}
              onChange={() => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email: !settings.notifications.email }
              })}
            />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Nouveaux messages</div>
              <div className="settings-description">Soyez notifié à chaque nouveau message de contact</div>
            </div>
            <ToggleSwitch 
              active={settings.notifications.newMessage}
              onChange={() => setSettings({
                ...settings,
                notifications: { ...settings.notifications, newMessage: !settings.notifications.newMessage }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
