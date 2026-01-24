import mongoose from 'mongoose';

const sectionSettingsSchema = new mongoose.Schema({
  sectionKey: {
    type: String,
    required: true,
    unique: true,
    enum: [
      'diwali-sale',
      'trending-products',
      'featured-products',
      'media-showcase',
      'collection-showcase',
      'collections',
      'reviews',
      'holi-sale'
    ]
  },
  title: {
    type: String,
    required: true,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  backgroundPattern: {
    type: String,
    enum: ['diwali', 'holi', 'festival', 'gold', 'elegant', 'modern'],
    default: 'elegant'
  },
  accentColor: {
    type: String,
    default: '#d4a574' // Gold color
  },
  showDecorativeStrip: {
    type: Boolean,
    default: true
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

export default mongoose.model('SectionSettings', sectionSettingsSchema);
