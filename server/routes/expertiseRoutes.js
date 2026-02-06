import express from 'express';
import Expertise from '../models/Expertise.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all expertises
router.get('/', async (req, res) => {
  try {
    const expertises = await Expertise.find().sort({ order: 1, createdAt: 1 });
    res.json(expertises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET active expertises only
router.get('/active', async (req, res) => {
  try {
    const expertises = await Expertise.find({ isActive: true }).sort({ order: 1 });
    res.json(expertises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create expertise
router.post('/', protect, async (req, res) => {
  const expertise = new Expertise({
    title: req.body.title,
    description: req.body.description,
    icon: req.body.icon,
    order: req.body.order || 0,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
  });

  try {
    const newExpertise = await expertise.save();
    res.status(201).json(newExpertise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update expertise
router.put('/:id', protect, async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id);
    if (!expertise) return res.status(404).json({ message: 'Expertise non trouvée' });

    expertise.title = req.body.title || expertise.title;
    expertise.description = req.body.description || expertise.description;
    expertise.icon = req.body.icon || expertise.icon;
    expertise.order = req.body.order !== undefined ? req.body.order : expertise.order;
    expertise.isActive = req.body.isActive !== undefined ? req.body.isActive : expertise.isActive;

    const updatedExpertise = await expertise.save();
    res.json(updatedExpertise);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE expertise
router.delete('/:id', protect, async (req, res) => {
  try {
    const expertise = await Expertise.findById(req.params.id);
    if (!expertise) return res.status(404).json({ message: 'Expertise non trouvée' });

    await expertise.deleteOne();
    res.json({ message: 'Expertise supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
