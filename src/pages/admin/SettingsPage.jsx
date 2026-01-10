import React, { useState } from 'react';
import { Save, User, Lock, Bell, Palette, Globe, Shield, Loader2 } from 'lucide-react';

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Site Vitrine',
    siteDescription: 'Entreprise de vente et promotion de pierres naturelles',
    contactEmail: 'contact@sitevitrine.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Pierre, 75001 Paris',
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

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    alert('Paramètres sauvegardés avec succès !');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Mot de passe modifié avec succès !');
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
        <button className="btn-accent-admin" onClick={handleSave} disabled={loading}>
          {loading ? (
            <Loader2 size={18} className="spinner" />
          ) : (
            <Save size={18} />
          )}
          Sauvegarder
        </button>
      </div>

      {/* General Settings */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <Globe size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Informations générales
            </h3>
            <p className="settings-section-description">Paramètres de base de votre site</p>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="form-group">
            <label className="form-label">Nom du site</label>
            <input
              type="text"
              className="form-input"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email de contact</label>
              <input
                type="email"
                className="form-input"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                className="form-input"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Adresse</label>
            <input
              type="text"
              className="form-input"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
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
            <button type="submit" className="btn-primary-admin" style={{ marginTop: '0.5rem' }}>
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
          <div className="settings-row">
            <div>
              <div className="settings-label">Rapport hebdomadaire</div>
              <div className="settings-description">Recevez un résumé de l'activité chaque semaine</div>
            </div>
            <ToggleSwitch 
              active={settings.notifications.weeklyReport}
              onChange={() => setSettings({
                ...settings,
                notifications: { ...settings.notifications, weeklyReport: !settings.notifications.weeklyReport }
              })}
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="settings-section">
        <div className="settings-section-header">
          <div>
            <h3 className="settings-section-title">
              <Palette size={20} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Apparence
            </h3>
            <p className="settings-section-description">Personnalisez l'interface d'administration</p>
          </div>
        </div>
        <div className="settings-section-body">
          <div className="settings-row">
            <div>
              <div className="settings-label">Mode sombre</div>
              <div className="settings-description">Utilisez un thème sombre pour l'interface</div>
            </div>
            <ToggleSwitch 
              active={settings.appearance.darkMode}
              onChange={() => setSettings({
                ...settings,
                appearance: { ...settings.appearance, darkMode: !settings.appearance.darkMode }
              })}
            />
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Mode compact</div>
              <div className="settings-description">Réduire l'espacement pour afficher plus de contenu</div>
            </div>
            <ToggleSwitch 
              active={settings.appearance.compactMode}
              onChange={() => setSettings({
                ...settings,
                appearance: { ...settings.appearance, compactMode: !settings.appearance.compactMode }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
