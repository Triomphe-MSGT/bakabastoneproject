import express from 'express';
import TeamMember from '../models/TeamMember.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all team members
router.get('/', async (req, res) => {
  try {
    const team = await TeamMember.find().sort({ order: 1 });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create team member (Admin)
router.post('/', protect, async (req, res) => {
  const member = new TeamMember({
    name: req.body.name,
    role: req.body.role,
    imageUrl: req.body.imageUrl,
    bio: req.body.bio,
    order: req.body.order,
  });

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update team member (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Membre non trouvé' });

    member.name = req.body.name || member.name;
    member.role = req.body.role || member.role;
    member.imageUrl = req.body.imageUrl || member.imageUrl;
    member.bio = req.body.bio || member.bio;
    member.order = req.body.order !== undefined ? req.body.order : member.order;

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE team member (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Membre non trouvé' });

    await member.deleteOne();
    res.json({ message: 'Membre supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
