import express from 'express';
import SectionSettings from '../models/SectionSettings.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all section settings (public)
router.get('/', async (req, res) => {
  try {
    const sections = await SectionSettings.find({ isActive: true });
    res.json({
      success: true,
      sections
    });
  } catch (error) {
    console.error('Error fetching section settings:', error);
    res.status(500).json({ error: 'Failed to fetch section settings' });
  }
});

// Get single section settings by key (public)
router.get('/:sectionKey', async (req, res) => {
  try {
    const section = await SectionSettings.findOne({ 
      sectionKey: req.params.sectionKey,
      isActive: true 
    });

    if (!section) {
      return res.status(404).json({ error: 'Section settings not found' });
    }

    res.json({
      success: true,
      section
    });
  } catch (error) {
    console.error('Error fetching section settings:', error);
    res.status(500).json({ error: 'Failed to fetch section settings' });
  }
});

// Admin: Update section settings
router.put('/:sectionKey', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, subtitle, description, backgroundPattern, accentColor, showDecorativeStrip } = req.body;

    let section = await SectionSettings.findOne({ sectionKey: req.params.sectionKey });

    if (!section) {
      section = new SectionSettings({
        sectionKey: req.params.sectionKey,
        title,
        subtitle,
        description,
        backgroundPattern,
        accentColor,
        showDecorativeStrip,
        isActive: true
      });
    } else {
      if (title) section.title = title;
      if (subtitle !== undefined) section.subtitle = subtitle;
      if (description !== undefined) section.description = description;
      if (backgroundPattern) section.backgroundPattern = backgroundPattern;
      if (accentColor) section.accentColor = accentColor;
      if (showDecorativeStrip !== undefined) section.showDecorativeStrip = showDecorativeStrip;
      section.updatedAt = new Date();
    }

    await section.save();

    res.json({
      success: true,
      section,
      message: 'Section settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating section settings:', error);
    res.status(500).json({ error: 'Failed to update section settings' });
  }
});

// Admin: Delete section settings
router.delete('/:sectionKey', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const section = await SectionSettings.findOneAndDelete({ sectionKey: req.params.sectionKey });

    if (!section) {
      return res.status(404).json({ error: 'Section settings not found' });
    }

    res.json({
      success: true,
      message: 'Section settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting section settings:', error);
    res.status(500).json({ error: 'Failed to delete section settings' });
  }
});

// Admin: Initialize default section settings
router.post('/initialize/defaults', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const defaults = [
      {
        sectionKey: 'diwali-sale',
        title: 'DIWALI SALE 🔥',
        subtitle: 'Exclusive Collections at Amazing Prices',
        backgroundPattern: 'diwali',
        accentColor: '#d4a574'
      },
      {
        sectionKey: 'holi-sale',
        title: 'HOLI SALE 🎨',
        subtitle: 'Festive Colors & Designs',
        backgroundPattern: 'holi',
        accentColor: '#d4a574'
      },
      {
        sectionKey: 'trending-products',
        title: 'New Arrivals',
        subtitle: 'Discover the latest and most sought-after pieces',
        backgroundPattern: 'elegant',
        accentColor: '#d4a574'
      },
      {
        sectionKey: 'featured-products',
        title: 'Featured Products',
        subtitle: 'Handpicked styles that define elegance and tradition',
        backgroundPattern: 'elegant',
        accentColor: '#d4a574'
      }
    ];

    const savedSections = [];
    for (const defaultSetting of defaults) {
      let section = await SectionSettings.findOne({ sectionKey: defaultSetting.sectionKey });
      
      if (!section) {
        section = new SectionSettings(defaultSetting);
        await section.save();
      }
      savedSections.push(section);
    }

    res.json({
      success: true,
      sections: savedSections,
      message: 'Default section settings initialized'
    });
  } catch (error) {
    console.error('Error initializing section settings:', error);
    res.status(500).json({ error: 'Failed to initialize section settings' });
  }
});

export default router;
