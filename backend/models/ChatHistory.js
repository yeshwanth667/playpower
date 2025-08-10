const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  pdfId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PDF',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
