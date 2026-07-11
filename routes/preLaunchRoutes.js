import express from 'express';
import PreLaunch from '../models/PreLaunch.js';

const router = express.Router();

// GET all pre-launch listings
router.get('/', async (req, res) => {
  try {
    const items = await PreLaunch.find({ isActive: true }).sort({ launchDate: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create pre-launch item (Admin)
router.post('/', async (req, res) => {
  try {
    const { heading, description, image, launchDate, category, location, priceRange } = req.body;
    const item = new PreLaunch({ heading, description, image, launchDate, category, location, priceRange });
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a pre-launch item (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const item = await PreLaunch.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Pre-launch item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
