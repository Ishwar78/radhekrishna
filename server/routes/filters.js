import express from 'express';
import Filter from '../models/Filter.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all active filters (public)
router.get('/', async (req, res) => {
  try {
    const filters = await Filter.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Group filters by type
    const groupedFilters = {
      sizes: [],
      colors: [],
      ethnicSubcategories: [],
      westernSubcategories: [],
    };

    filters.forEach((filter) => {
      if (filter.type === 'size') {
        groupedFilters.sizes.push({ id: filter._id, name: filter.name });
      } else if (filter.type === 'color') {
        groupedFilters.colors.push({
          id: filter._id,
          name: filter.name,
          hex: filter.hex,
        });
      } else if (filter.type === 'ethnicSubcategory') {
        groupedFilters.ethnicSubcategories.push({
          id: filter._id,
          name: filter.name,
        });
      } else if (filter.type === 'westernSubcategory') {
        groupedFilters.westernSubcategories.push({
          id: filter._id,
          name: filter.name,
        });
      }
    });

    res.json({
      success: true,
      filters: groupedFilters,
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// Get filters by type (public)
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['size', 'color', 'ethnicSubcategory', 'westernSubcategory'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid filter type' });
    }

    const filters = await Filter.find({ type, isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const formattedFilters = filters.map((filter) => {
      const obj = {
        id: filter._id,
        name: filter.name,
      };
      if (type === 'color' && filter.hex) {
        obj.hex = filter.hex;
      }
      return obj;
    });

    res.json({
      success: true,
      type,
      filters: formattedFilters,
    });
  } catch (error) {
    console.error('Error fetching filters by type:', error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// Admin: Get all filters (including inactive)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const filters = await Filter.find()
      .sort({ type: 1, order: 1, createdAt: 1 })
      .lean();

    // Group by type
    const groupedFilters = {
      sizes: [],
      colors: [],
      ethnicSubcategories: [],
      westernSubcategories: [],
    };

    filters.forEach((filter) => {
      const filterObj = {
        id: filter._id,
        name: filter.name,
        isActive: filter.isActive,
        order: filter.order,
      };

      if (filter.type === 'size') {
        groupedFilters.sizes.push(filterObj);
      } else if (filter.type === 'color') {
        filterObj.hex = filter.hex;
        groupedFilters.colors.push(filterObj);
      } else if (filter.type === 'ethnicSubcategory') {
        groupedFilters.ethnicSubcategories.push(filterObj);
      } else if (filter.type === 'westernSubcategory') {
        groupedFilters.westernSubcategories.push(filterObj);
      }
    });

    res.json({
      success: true,
      filters: groupedFilters,
      total: filters.length,
    });
  } catch (error) {
    console.error('Error fetching admin filters:', error);
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

// Admin: Create filter
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { type, name, hex, order } = req.body;

    if (!type || !name) {
      return res.status(400).json({ error: 'Type and name are required' });
    }

    const validTypes = ['size', 'color', 'ethnicSubcategory', 'westernSubcategory'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid filter type' });
    }

    // Check if already exists
    const existing = await Filter.findOne({ type, name });
    if (existing) {
      return res.status(400).json({ error: 'This filter already exists' });
    }

    const filter = new Filter({
      type,
      name,
      hex: type === 'color' ? hex : null,
      order: order || 0,
      isActive: true,
    });

    await filter.save();

    res.status(201).json({
      success: true,
      filter: {
        id: filter._id,
        type: filter.type,
        name: filter.name,
        hex: filter.hex,
        order: filter.order,
        isActive: filter.isActive,
      },
    });
  } catch (error) {
    console.error('Error creating filter:', error);
    res.status(500).json({ error: 'Failed to create filter' });
  }
});

// Admin: Update filter
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hex, order, isActive } = req.body;

    const filter = await Filter.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        hex: hex || undefined,
        order: order !== undefined ? order : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!filter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    res.json({
      success: true,
      filter: {
        id: filter._id,
        type: filter.type,
        name: filter.name,
        hex: filter.hex,
        order: filter.order,
        isActive: filter.isActive,
      },
    });
  } catch (error) {
    console.error('Error updating filter:', error);
    res.status(500).json({ error: 'Failed to update filter' });
  }
});

// Admin: Delete filter
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const filter = await Filter.findByIdAndDelete(id);

    if (!filter) {
      return res.status(404).json({ error: 'Filter not found' });
    }

    res.json({
      success: true,
      message: 'Filter deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting filter:', error);
    res.status(500).json({ error: 'Failed to delete filter' });
  }
});

// Admin: Reorder filters
router.put('/reorder/:type', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { type } = req.params;
    const { filters } = req.body;

    if (!Array.isArray(filters)) {
      return res.status(400).json({ error: 'Filters array is required' });
    }

    // Update order for each filter
    const updatePromises = filters.map((filter, index) =>
      Filter.findByIdAndUpdate(filter.id, { order: index })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Filters reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering filters:', error);
    res.status(500).json({ error: 'Failed to reorder filters' });
  }
});

export default router;
