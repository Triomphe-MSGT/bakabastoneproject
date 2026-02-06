import express from 'express';
import Collection from '../models/Collection.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all collections with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Collection.countDocuments();
    const collections = await Collection.find()
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      collections,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCollections: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET active collections only (for public site) with pagination
router.get('/active', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const total = await Collection.countDocuments({ isActive: true });
    const collections = await Collection.find({ isActive: true })
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      collections,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCollections: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one collection
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection non trouvée' });
    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create collection
router.post('/', protect, async (req, res) => {
  const collection = new Collection({
    name: req.body.name,
    description: req.body.description,
    expertDescription: req.body.expertDescription || '',
    features: req.body.features || [],
    imageUrl: req.body.imageUrl,
    order: req.body.order || 0,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
    pricePerM2: req.body.pricePerM2 || 0,
  });

  try {
    const newCollection = await collection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update collection
router.put('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection non trouvée' });

    collection.name = req.body.name || collection.name;
    collection.description = req.body.description || collection.description;
    collection.expertDescription = req.body.expertDescription !== undefined ? req.body.expertDescription : collection.expertDescription;
    collection.features = req.body.features !== undefined ? req.body.features : collection.features;
    collection.imageUrl = req.body.imageUrl || collection.imageUrl;
    collection.order = req.body.order !== undefined ? req.body.order : collection.order;
    collection.isActive = req.body.isActive !== undefined ? req.body.isActive : collection.isActive;
    collection.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : collection.isAvailable;
    collection.pricePerM2 = req.body.pricePerM2 !== undefined ? req.body.pricePerM2 : collection.pricePerM2;

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE collection
router.delete('/:id', protect, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection non trouvée' });

    await collection.deleteOne();
    res.json({ message: 'Collection supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
