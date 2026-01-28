import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all approved and featured testimonials (public)
router.get('/featured', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true, isFeatured: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all testimonials (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create testimonial (public - anyone can submit)
router.post('/', async (req, res) => {
  const testimonial = new Testimonial({
    name: req.body.name,
    email: req.body.email,
    company: req.body.company || '',
    job: req.body.job || '',
    rating: req.body.rating,
    message: req.body.message,
    imageUrl: req.body.imageUrl || '',
  });

  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update testimonial (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });

    testimonial.name = req.body.name || testimonial.name;
    testimonial.email = req.body.email || testimonial.email;
    testimonial.company = req.body.company !== undefined ? req.body.company : testimonial.company;
    testimonial.job = req.body.job !== undefined ? req.body.job : testimonial.job;
    testimonial.rating = req.body.rating !== undefined ? req.body.rating : testimonial.rating;
    testimonial.message = req.body.message || testimonial.message;
    testimonial.imageUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : testimonial.imageUrl;
    testimonial.isApproved = req.body.isApproved !== undefined ? req.body.isApproved : testimonial.isApproved;
    testimonial.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : testimonial.isFeatured;

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH toggle approval (admin only)
router.patch('/:id/approve', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });

    testimonial.isApproved = !testimonial.isApproved;
    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH toggle featured (admin only)
router.patch('/:id/feature', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });

    testimonial.isFeatured = !testimonial.isFeatured;
    // Auto-approve when featuring
    if (testimonial.isFeatured && !testimonial.isApproved) {
      testimonial.isApproved = true;
    }
    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE testimonial (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });

    await testimonial.deleteOne();
    res.json({ message: 'Témoignage supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
