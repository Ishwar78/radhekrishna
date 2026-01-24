import express from 'express';
import SidebarVideo from '../models/SidebarVideo.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { isValidObjectId } from '../utils/validation.js';

const router = express.Router();

// Get active sidebar videos (public)
router.get('/', async (req, res) => {
  try {
    const videos = await SidebarVideo.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      videos,
      total: videos.length,
    });
  } catch (error) {
    console.error('Error fetching sidebar videos:', error);
    res.status(500).json({ error: 'Failed to fetch sidebar videos' });
  }
});

// Get all sidebar videos (admin - including inactive)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const videos = await SidebarVideo.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    res.json({
      success: true,
      videos,
      total: videos.length,
    });
  } catch (error) {
    console.error('Error fetching sidebar videos:', error);
    res.status(500).json({ error: 'Failed to fetch sidebar videos' });
  }
});

// Get single sidebar video
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const video = await SidebarVideo.findById(req.params.id).lean();

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Error fetching sidebar video:', error);
    res.status(500).json({ error: 'Failed to fetch sidebar video' });
  }
});

// Create sidebar video (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      videoType,
      thumbnailUrl,
      position,
      displayDuration,
      isActive,
      order,
    } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ error: 'Title and video URL are required' });
    }

    const video = new SidebarVideo({
      title,
      description: description || '',
      videoUrl,
      videoType: videoType || 'html5',
      thumbnailUrl: thumbnailUrl || '',
      position: position || 'right',
      displayDuration: displayDuration || 0,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    await video.save();

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error('Error creating sidebar video:', error);
    res.status(500).json({ error: 'Failed to create sidebar video' });
  }
});

// Update sidebar video (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const {
      title,
      description,
      videoUrl,
      videoType,
      thumbnailUrl,
      position,
      displayDuration,
      isActive,
      order,
    } = req.body;

    const video = await SidebarVideo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        videoUrl,
        videoType,
        thumbnailUrl,
        position,
        displayDuration,
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
    console.error('Error updating sidebar video:', error);
    res.status(500).json({ error: 'Failed to update sidebar video' });
  }
});

// Delete sidebar video (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const video = await SidebarVideo.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      success: true,
      message: 'Sidebar video deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting sidebar video:', error);
    res.status(500).json({ error: 'Failed to delete sidebar video' });
  }
});

export default router;
