import mongoose from 'mongoose';

const filterSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['size', 'color', 'ethnicSubcategory', 'westernSubcategory'],
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  hex: {
    type: String,
    default: null, // Only for colors
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound index for uniqueness per type
filterSchema.index({ type: 1, name: 1 }, { unique: true });

export default mongoose.model('Filter', filterSchema);
