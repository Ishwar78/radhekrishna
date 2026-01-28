import mongoose from 'mongoose';

const chatbotSettingsSchema = new mongoose.Schema({
  businessName: {
    type: String,
    default: 'Shree RadheKrishna Collection'
  },
  welcomeMessage: {
    type: String,
    default: 'Namaste! 🙏 Welcome to our store. I\'m here to help you with any questions about our products, delivery, or orders.'
  },
  supportEmail: {
    type: String,
    default: 'support@vasstra.com'
  },
  supportPhone: {
    type: String,
    default: '+91 98765 43210'
  },
  whatsappNumber: {
    type: String,
    default: '919876543210'
  },
  genericReply: {
    type: String,
    default: 'Thanks for your message! Our team will get back to you shortly. For immediate assistance, please contact us at {email} or WhatsApp {whatsapp}.'
  },
  storeHours: {
    type: String,
    default: 'Monday - Saturday: 10:00 AM - 7:00 PM\nSunday: Closed'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ChatbotSettings', chatbotSettingsSchema);
