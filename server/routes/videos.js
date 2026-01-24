import express from 'express';
import Video from '../models/Video.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { isValidObjectId } from '../utils/validation.js';

const router = express.Router();

// Get all active videos (public)
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      videos,
      total: videos.length,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get all videos (admin - including inactive)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      videos,
      total: videos.length,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get single video
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const video = await Video.findById(req.params.id).lean();

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Create video (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      url,
      category,
      price,
      originalPrice,
      badge,
      productId,
      isActive,
      order,
    } = req.body;

    if (!title || !url || !price || !originalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const video = new Video({
      title,
      description: description || '',
      url,
      category: category || 'ETHNIC WEAR',
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice),
      badge: badge || null,
      productId: productId || '',
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    await video.save();

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Update video (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const {
      title,
      description,
      url,
      category,
      price,
      originalPrice,
      badge,
      productId,
      isActive,
      order,
    } = req.body;

    const video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        url,
        category,
        price: price ? parseFloat(price) : undefined,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        badge,
        productId,
        isActive,
        order,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});


export default router;
