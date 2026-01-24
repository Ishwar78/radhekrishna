import express from 'express';
import Offer from '../models/Offer.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { isValidObjectId } from '../utils/validation.js';

const router = express.Router();

// Get all active offers (public)
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ displayOrder: 1 });
    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Get all offers (admin - including inactive)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const offers = await Offer.find().sort({ displayOrder: 1 });
    res.json({
      success: true,
      offers,
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Get single offer
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({
      success: true,
      offer,
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ error: 'Failed to fetch offer' });
  }
});

// Create offer (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      backgroundImage,
      badge,
      ctaText,
      ctaLink,
      isActive,
      displayOrder,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const offer = new Offer({
      title,
      subtitle,
      description,
      backgroundImage,
      badge,
      ctaText,
      ctaLink,
      isActive,
      displayOrder,
    });

    await offer.save();
    res.status(201).json({
      success: true,
      offer,
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

// Update offer (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const {
      title,
      subtitle,
      description,
      backgroundImage,
      badge,
      ctaText,
      ctaLink,
      isActive,
      displayOrder,
    } = req.body;

    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        description,
        backgroundImage,
        badge,
        ctaText,
        ctaLink,
        isActive,
        displayOrder,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({
      success: true,
      offer,
    });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: 'Failed to update offer' });
  }
});

// Delete offer (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid offer ID' });
    }

    const offer = await Offer.findByIdAndDelete(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({
      success: true,
      message: 'Offer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ error: 'Failed to delete offer' });
  }
});

export default router;
