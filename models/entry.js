const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  text: { type: String, required: true },
  tag: { type: String, required: true },
  song: String,
  stringColor: { type: String, default: 'red' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', entrySchema);
