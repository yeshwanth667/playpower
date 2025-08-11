const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  pdfId: { type: mongoose.Schema.Types.ObjectId, ref: 'PDF' },
  question: String,
  answer: String,
  citationPage: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chat', chatSchema);
