import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

// Submit an inquiry (public endpoint)
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: 'All fields including phone number are required' });
    }

    // Basic validation
    if (phone.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'Please enter a valid phone number' });
    }

    // Create new inquiry
    const inquiry = new Inquiry({
      name,
      email: email.toLowerCase(),
      phone,
      subject,
      message,
      status: 'new'
    });

    await inquiry.save();

    // Send confirmation email to user
    const userEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
          .header { background-color: #7a2139; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
          .inquiry-details { background-color: #f0f0f0; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Inquiry</h1>
          </div>

          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We've received your inquiry and will get back to you within 24 hours.</p>

            <div class="inquiry-details">
              <p><strong>Your Inquiry Details:</strong></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message.substring(0, 200)}...</p>
            </div>

            <p>Our team will review your message and contact you soon at <strong>${phone}</strong> or <strong>${email}</strong>.</p>

            <p>Thank you for choosing ShreeradheKrishnacollection!</p>
          </div>

          <div class="footer">
            <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, '✓ We Received Your Inquiry - ShreeradheKrishnacollection', userEmailTemplate);

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. We will get back to you soon.',
      inquiry: {
        id: inquiry._id,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        subject: inquiry.subject
      }
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// Get all inquiries (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Inquiry.countDocuments(query);
    const inquiries = await Inquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      inquiries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Get single inquiry (admin only)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({
      success: true,
      inquiry
    });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({ error: 'Failed to fetch inquiry' });
  }
});

// Update inquiry status and add reply (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, adminReply } = req.body;

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        status: status || undefined,
        adminReply: adminReply || undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    // If status is being changed, optionally send email to user
    if (status === 'replied' && adminReply) {
      const replyEmailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; }
            .header { background-color: #7a2139; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; color: #666; font-size: 12px; padding: 10px; }
            .reply { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>We've Replied to Your Inquiry</h1>
            </div>

            <div class="content">
              <h2>Hello ${inquiry.name},</h2>
              <p>Thank you for your patience. Here's our response to your inquiry:</p>

              <div class="reply">
                <p><strong>Re: ${inquiry.subject}</strong></p>
                <p>${adminReply}</p>
              </div>

              <p>If you have any further questions, please don't hesitate to contact us.</p>
              <p>Thank you for choosing ShreeradheKrishnacollection!</p>
            </div>

            <div class="footer">
              <p>© 2024 ShreeradheKrishnacollection - Premium Ethnic Fashion. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail(inquiry.email, 'Reply to Your Inquiry - ShreeradheKrishnacollection', replyEmailTemplate);
    }

    res.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Failed to update inquiry' });
  }
});

// Delete inquiry (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;
