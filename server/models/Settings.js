import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Liteos' },
  siteDescription: { type: String, default: 'Entreprise de vente et promotion de pierres naturelles' },
  contactEmail: { type: String, default: 'contact@liteos.fr' },
  phone: { type: String, default: '+33 1 23 45 67 89' },
  address: { type: String, default: '123 Rue de la Pierre, 75001 Paris' },
  workingHours: { type: String, default: 'Lun - Ven: 9h00 - 18h00 | Sam: 10h00 - 16h00' },
  whatsappNumber: { type: String, default: '+237698943052' },
  facebookUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  tiktokUrl: { type: String, default: '' },
  telegramUrl: { type: String, default: '' },
  aboutImageUrl: { type: String, default: '' },
  aboutText: { type: String, default: '' },
  notifications: {
    email: { type: Boolean, default: true },
    newMessage: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: false },
  },
  appearance: {
    darkMode: { type: Boolean, default: false },
    compactMode: { type: Boolean, default: false },
  },
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
