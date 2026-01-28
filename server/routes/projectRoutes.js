import express from 'express';
import Project from '../models/Project.js';

const router = express.Router();

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create project
router.post('/', async (req, res) => {
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    category: req.body.category,
    materials: req.body.materials || [],
    totalPrice: req.body.totalPrice || 0,
    dimensions: req.body.dimensions || '',
    likes: req.body.likes || 0,
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.imageUrl = req.body.imageUrl || project.imageUrl;
    project.category = req.body.category || project.category;
    project.materials = req.body.materials !== undefined ? req.body.materials : project.materials;
    project.totalPrice = req.body.totalPrice !== undefined ? req.body.totalPrice : project.totalPrice;
    project.dimensions = req.body.dimensions !== undefined ? req.body.dimensions : project.dimensions;
    project.likes = req.body.likes !== undefined ? req.body.likes : project.likes;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    await project.deleteOne();
    res.json({ message: 'Projet supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH like project
router.patch('/:id/like', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });

    project.likes += 1;
    await project.save();
    res.json({ likes: project.likes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
