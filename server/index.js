import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import expertiseRoutes from './routes/expertiseRoutes.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/expertise', expertiseRoutes);

// MongoDB Connection & Seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sitevitrine')
  .then(async () => {
    console.log('Connecté à MongoDB');
    
    // Seed Admin User
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new User({ username: 'admin', password: '00000000' });
      await admin.save();
      console.log('Admin user created: admin / 00000000');
    }
  })
  .catch((err) => console.error('Erreur de connexion MongoDB:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('API Site Vitrine en ligne');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
