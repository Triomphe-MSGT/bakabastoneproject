import express from 'express';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

const router = express.Router();

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST upload image
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléversé' });
    }

    // req.file.path will contain the Cloudinary URL when using CloudinaryStorage
    const imageUrl = req.file.path;
    
    res.status(201).json({
      message: 'Image téléversée avec succès sur Cloudinary',
      imageUrl: imageUrl,
      public_id: req.file.filename
    });
  } catch (error) {
    console.error('Erreur Upload:', error);
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Le fichier est trop volumineux. Maximum 5MB.' });
    }
    return res.status(400).json({ message: error.message });
  }
  
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  
  next();
});

export default router;
