import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  backgroundImage: {
    type: String
  },
  badge: {
    type: String,
    default: null
  },
  ctaText: {
    type: String,
    default: 'Shop Now'
  },
  ctaLink: {
    type: String,
    default: '/shop'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
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

export default mongoose.model('Offer', offerSchema);
