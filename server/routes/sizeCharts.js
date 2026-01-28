import express from 'express';
import mongoose from 'mongoose';
import SizeChart from '../models/SizeChart.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get size chart by product ID (public)
router.get('/product/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    // Convert string to ObjectId if valid
    const query = mongoose.Types.ObjectId.isValid(productId)
      ? { productId: new mongoose.Types.ObjectId(productId) }
      : { productId };

    const sizeChart = await SizeChart.findOne(query);

    if (!sizeChart) {
      return res.json({
        success: true,
        sizeChart: null,
        message: 'No size chart found for this product'
      });
    }

    res.json({
      success: true,
      sizeChart
    });
  } catch (error) {
    console.error('Get size chart error:', error);
    res.status(500).json({ error: 'Failed to fetch size chart' });
  }
});

// Create or update size chart (admin only)
router.post('/product/:productId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { productId: productIdParam } = req.params;
    const { sizes, unit, chartImage } = req.body;

    // Convert string to ObjectId if valid
    const productId = mongoose.Types.ObjectId.isValid(productIdParam)
      ? new mongoose.Types.ObjectId(productIdParam)
      : productIdParam;

    // Log image data for debugging
    if (chartImage) {
      console.log(`Size chart image received: ${chartImage.substring(0, 50)}... (length: ${chartImage.length})`);
    }

    let sizeChart = await SizeChart.findOne({ productId });

    if (sizeChart) {
      // Update existing
      sizeChart.sizes = sizes;
      if (unit) sizeChart.unit = unit;
      if (chartImage !== undefined) sizeChart.chartImage = chartImage;
      sizeChart.updatedAt = new Date();
      await sizeChart.save();
    } else {
      // Create new
      sizeChart = new SizeChart({
        productId,
        sizes,
        unit: unit || 'cm',
        chartImage: chartImage || null
      });
      await sizeChart.save();
    }

    // Log what's being returned
    console.log(`Size chart saved with ${sizeChart.sizes.length} sizes and ${sizeChart.chartImage ? 'image' : 'no image'}`);

    res.json({
      success: true,
      sizeChart,
      message: 'Size chart saved successfully'
    });
  } catch (error) {
    console.error('Save size chart error:', error);
    res.status(500).json({ error: 'Failed to save size chart' });
  }
});

// Delete size chart (admin only)
router.delete('/product/:productId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId;
    // Convert string to ObjectId if valid
    const query = mongoose.Types.ObjectId.isValid(productId)
      ? { productId: new mongoose.Types.ObjectId(productId) }
      : { productId };

    const sizeChart = await SizeChart.findOneAndDelete(query);

    if (!sizeChart) {
      return res.status(404).json({ error: 'Size chart not found' });
    }

    res.json({
      success: true,
      message: 'Size chart deleted successfully'
    });
  } catch (error) {
    console.error('Delete size chart error:', error);
    res.status(500).json({ error: 'Failed to delete size chart' });
  }
});

export default router;
