const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  gradeLevel: {
    type: String,
    trim: true,
    default: null
  },
  subject: {
    type: String,
    trim: true,
    default: null
  },
  series: {
    type: String,
    trim: true,
    default: null
  },
  imageUrl: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    trim: true,
    default: null
  },
  publisher: {
    type: String,
    trim: true,
    default: null
  },
  publicationYear: {
    type: Number,
    default: null
  },
  pages: {
    type: Number,
    default: null
  },
  description: {
    type: String,
    trim: true,
    default: null
  },
  aiExtracted: {
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
}, {
  timestamps: true
});

// Index for search functionality
bookSchema.index({ 
  title: 'text', 
  author: 'text', 
  subject: 'text', 
  series: 'text' 
});

// Pre-save middleware to update the updatedAt field
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Book', bookSchema); 