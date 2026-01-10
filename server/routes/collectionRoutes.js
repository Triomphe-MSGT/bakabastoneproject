import express from 'express';
import Collection from '../models/Collection.js';

const router = express.Router();

// GET all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find().sort({ order: 1, createdAt: -1 });
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET active collections only (for public site)
router.get('/active', async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true }).sort({ order: 1 });
    res.json(collections);
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
router.post('/', async (req, res) => {
  const collection = new Collection({
    name: req.body.name,
    description: req.body.description,
    expertDescription: req.body.expertDescription || '',
    features: req.body.features || [],
    imageUrl: req.body.imageUrl,
    order: req.body.order || 0,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
  });

  try {
    const newCollection = await collection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update collection
router.put('/:id', async (req, res) => {
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

    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE collection
router.delete('/:id', async (req, res) => {
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
