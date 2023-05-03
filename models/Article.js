const mongoose = require('mongoose');

// Define the article schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  label: {
    type: String,
    enum: ["Politics","Sports","Breaking News","Weather","Technology","Entertainment"],
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},{
  versionKey: false,
});

// Create the article model
const article = mongoose.model('article', articleSchema);

// Export the article model
module.exports = article;
