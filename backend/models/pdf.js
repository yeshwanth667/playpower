const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  filename: String,
  uploadedBy: String, // UserID or name
  uploadDate: { type: Date, default: Date.now },
  totalPages: Number,
});

module.exports = mongoose.model('PDF', pdfSchema);
