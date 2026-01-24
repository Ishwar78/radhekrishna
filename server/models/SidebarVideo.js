import mongoose from 'mongoose';

const sidebarVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  videoUrl: {
    type: String,
    required: true,
  },
  videoType: {
    type: String,
    enum: ['html5', 'youtube', 'vimeo', 'instagram', 'tiktok'],
    default: 'html5'
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  position: {
    type: String,
    enum: ['left', 'right'],
    default: 'right'
  },
  displayDuration: {
    type: Number,
    default: 0, // 0 means always show
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
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

export default mongoose.model('SidebarVideo', sidebarVideoSchema);
