import express from 'express';
import Collection from '../models/Collection.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { isValidObjectId } from '../utils/validation.js';

const router = express.Router();

// Get all active collections (public)
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Get all collections (admin - including inactive)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const collections = await Collection.find().sort({ displayOrder: 1 });
    res.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

// Get single collection
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid collection ID' });
    }

    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Failed to fetch collection' });
  }
});

// Create collection (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      link,
      buttonText,
      badge,
      displayOrder,
      isActive,
    } = req.body;

    if (!name || !image) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    const collection = new Collection({
      name,
      description,
      image,
      link,
      buttonText,
      badge,
      displayOrder,
      isActive,
    });

    await collection.save();
    res.status(201).json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// Update collection (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid collection ID' });
    }

    const {
      name,
      description,
      image,
      link,
      buttonText,
      badge,
      displayOrder,
      isActive,
    } = req.body;

    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        image,
        link,
        buttonText,
        badge,
        displayOrder,
        isActive,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      success: true,
      collection,
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// Delete collection (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid collection ID' });
    }

    const collection = await Collection.findByIdAndDelete(req.params.id);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    res.json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

export default router;
