import express from 'express';
import ChatbotSettings from '../models/ChatbotSettings.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get chatbot settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await ChatbotSettings.findOne();

    if (!settings) {
      // Create default settings if doesn't exist
      settings = new ChatbotSettings();
      await settings.save();
    }

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching chatbot settings:', error);
    res.status(500).json({ error: 'Failed to fetch chatbot settings' });
  }
});

// Update chatbot settings (admin only)
router.put('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      businessName,
      welcomeMessage,
      supportEmail,
      supportPhone,
      whatsappNumber,
      genericReply,
      storeHours,
      isActive,
    } = req.body;

    let settings = await ChatbotSettings.findOne();

    if (!settings) {
      settings = new ChatbotSettings();
    }

    // Update fields
    if (businessName) settings.businessName = businessName;
    if (welcomeMessage) settings.welcomeMessage = welcomeMessage;
    if (supportEmail) settings.supportEmail = supportEmail;
    if (supportPhone) settings.supportPhone = supportPhone;
    if (whatsappNumber) settings.whatsappNumber = whatsappNumber;
    if (genericReply) settings.genericReply = genericReply;
    if (storeHours) settings.storeHours = storeHours;
    if (isActive !== undefined) settings.isActive = isActive;
    settings.updatedAt = new Date();

    await settings.save();

    res.json({
      success: true,
      message: 'Chatbot settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating chatbot settings:', error);
    res.status(500).json({ error: 'Failed to update chatbot settings' });
  }
});

export default router;
