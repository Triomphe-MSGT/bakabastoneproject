import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import expertiseRoutes from './routes/expertiseRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import settingsRoutes from './routes/settingsRoutes.js';
import basicAuth from './middleware/basicAuth.js';

// Système d'accès secret : Intercepte toute requête vers l'URL secrète
if (process.env.ADMIN_PATH) {
  app.use(process.env.ADMIN_PATH, basicAuth);
}

app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/expertise', expertiseRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/testimonials', testimonialRoutes);

// MongoDB Connection & Seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sitevitrine')
  .then(async () => {
    console.log('Connecté à MongoDB');
    
    // Seed/Update Admin User from .env to ensure synchronization
    const adminUsername = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASS || '00000000';
    
    let admin = await User.findOne({ username: adminUsername });
    
    if (!admin) {
      admin = new User({ username: adminUsername, password: adminPassword });
      await admin.save();
      console.log(`Admin user created: ${adminUsername} (sync with .env)`);
    } else {
      // Optionnel: On peut forcer la mise à jour si on veut que le .env soit la source unique de vérité
      admin.password = adminPassword;
      await admin.save();
      console.log(`Admin user password synchronized with .env`);
    }
  })
  .catch((err) => console.error('Erreur de connexion MongoDB:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('API Site Vitrine en ligne');
});

// Start Server - Only if not running as a Vercel function
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL) {
    // Note: Vercel normally doesn't need this, but for local testing or other environments it might.
    // However, Vercel will ignore app.listen() if we export the app.
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

export default app;
