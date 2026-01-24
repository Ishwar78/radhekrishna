import express from 'express';
import Review from '../models/Review.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { isValidObjectId } from '../utils/validation.js';

const router = express.Router();

// Public endpoint - Get all active reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Admin endpoint - Get all reviews (including inactive)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ order: 1, createdAt: -1 });
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Admin endpoint - Create review
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { customerName, customerImage, reviewText, rating, isActive, order } = req.body;

    if (!customerName || !customerImage || !reviewText) {
      return res.status(400).json({
        error: 'Customer name, image, and review text are required'
      });
    }

    const review = new Review({
      customerName,
      customerImage,
      reviewText,
      rating: rating || 5,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await review.save();

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Admin endpoint - Update review
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const { customerName, customerImage, reviewText, rating, isActive, order } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        customerName,
        customerImage,
        reviewText,
        rating,
        isActive,
        order,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Admin endpoint - Delete review
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Admin endpoint - Reorder reviews
router.put('/reorder/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { reviews } = req.body;

    if (!Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Reviews array is required' });
    }

    for (let i = 0; i < reviews.length; i++) {
      const reviewId = reviews[i]._id || reviews[i].id;
      if (!isValidObjectId(reviewId)) {
        return res.status(400).json({ error: `Invalid review ID at index ${i}` });
      }
      await Review.findByIdAndUpdate(
        reviewId,
        { order: i }
      );
    }

    res.json({
      success: true,
      message: 'Reviews reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering reviews:', error);
    res.status(500).json({ error: 'Failed to reorder reviews' });
  }
});

export default router;
