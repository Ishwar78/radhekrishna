import mongoose from 'mongoose';

const productSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  heading: {
    type: String,
    required: true,
    trim: true
  },
  subheading: {
    type: String,
    trim: true
  },
  productIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  displayLayout: {
    type: String,
    enum: ['featured', 'carousel', 'grid', 'asymmetric'],
    default: 'asymmetric'
  },
  backgroundImage: {
    type: String,
    default: null
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

export default mongoose.model('ProductSection', productSectionSchema);
