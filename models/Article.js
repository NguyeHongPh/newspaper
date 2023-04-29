const mongoose = require('mongoose');

// Define the article schema
const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  assignee: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ['pending', 'working', 'review', 'done', 'archive'],
    default: 'pending'
  },
  label: {
    type: String,
    enum: ["Politics","Sports","Breaking News","Weather","Technology","Entertainment"],
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
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

// Create the article model
const article = mongoose.model('article', articleSchema);

// Export the article model
module.exports = article;
