const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  points: { type: Number, default: 0 },
  author: { type: String, required: true },
  postedAt: { type: String, required: true },
  hnId: { type: String, unique: true, sparse: true } // to prevent duplicate scraping if needed
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);
