const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF' },
  page: Number,
  content: String,
  embedding: [Number], // Optional if storing vector embeddings
});

module.exports = mongoose.model('Chunk', chunkSchema);
