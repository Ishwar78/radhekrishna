import express from 'express';
import ProductSection from '../models/ProductSection.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { isValidObjectId } from '../utils/validation.js';

const router = express.Router();

// Get all active product sections (public)
router.get('/', async (req, res) => {
  try {
    const sections = await ProductSection.find({ isActive: true })
      .populate('productIds')
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    console.error('Error fetching product sections:', error);
    res.status(500).json({ error: 'Failed to fetch product sections' });
  }
});

// Get all sections (admin - including inactive) - MUST BE BEFORE /:id
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const sections = await ProductSection.find()
      .populate('productIds')
      .sort({ displayOrder: 1 });

    res.json({
      success: true,
      sections,
    });
  } catch (error) {
    console.error('Error fetching product sections:', error);
    res.status(500).json({ error: 'Failed to fetch product sections' });
  }
});

// Get single section by name (public)
router.get('/name/:name', async (req, res) => {
  try {
    console.log(`Fetching product section with name: ${req.params.name}`);
    const section = await ProductSection.findOne({ name: req.params.name, isActive: true })
      .populate('productIds');

    if (!section) {
      console.log(`Section not found with name: ${req.params.name}. Checking all sections...`);
      // Try without isActive filter for debugging
      const allSections = await ProductSection.find({ name: req.params.name });
      console.log(`Sections found (all): ${allSections.length}`);
      allSections.forEach(s => {
        console.log(`  - Name: ${s.name}, Active: ${s.isActive}, Products: ${s.productIds.length}`);
      });
      return res.status(404).json({ error: 'Section not found' });
    }

    console.log(`Section found: ${section.name}, Products: ${section.productIds.length}`);
    res.json({
      success: true,
      section,
    });
  } catch (error) {
    console.error('Error fetching product section:', error);
    res.status(500).json({ error: 'Failed to fetch product section' });
  }
});

// Get single section by ID (public)
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid section ID' });
    }

    const section = await ProductSection.findById(req.params.id).populate('productIds');

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json({
      success: true,
      section,
    });
  } catch (error) {
    console.error('Error fetching product section:', error);
    res.status(500).json({ error: 'Failed to fetch product section' });
  }
});

// Create section (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      name,
      heading,
      subheading,
      productIds,
      displayLayout,
      backgroundImage,
      isActive,
      displayOrder,
    } = req.body;

    if (!name || !heading) {
      return res.status(400).json({ error: 'Name and heading are required' });
    }

    console.log(`Creating product section: name=${name}, heading=${heading}, products=${productIds?.length || 0}`);

    const section = new ProductSection({
      name,
      heading,
      subheading,
      productIds: productIds || [],
      displayLayout,
      backgroundImage,
      isActive,
      displayOrder,
    });

    await section.save();
    await section.populate('productIds');

    console.log(`Product section created successfully: ${section._id}`);
    res.status(201).json({
      success: true,
      section,
    });
  } catch (error) {
    console.error('Error creating product section:', error);
    res.status(500).json({ error: 'Failed to create product section' });
  }
});

// Update section (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid section ID' });
    }

    const {
      name,
      heading,
      subheading,
      productIds,
      displayLayout,
      backgroundImage,
      isActive,
      displayOrder,
    } = req.body;

    console.log(`Updating product section: ${req.params.id}, products=${productIds?.length || 0}`);

    const section = await ProductSection.findByIdAndUpdate(
      req.params.id,
      {
        name,
        heading,
        subheading,
        productIds,
        displayLayout,
        backgroundImage,
        isActive,
        displayOrder,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('productIds');

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    console.log(`Product section updated successfully: ${section._id}`);
    res.json({
      success: true,
      section,
    });
  } catch (error) {
    console.error('Error updating product section:', error);
    res.status(500).json({ error: 'Failed to update product section' });
  }
});

// Delete section (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid section ID' });
    }

    const section = await ProductSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }

    res.json({
      success: true,
      message: 'Product section deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product section:', error);
    res.status(500).json({ error: 'Failed to delete product section' });
  }
});

export default router;
