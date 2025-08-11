const Chunk = require('../models/Chunk');
const mongoose=require('mongoose')

// Save multiple chunks for a PDF
const saveChunks = async (req, res) => {
  try {
    const { pdfId, chunks } = req.body;

    const objectId = new mongoose.Types.ObjectId(pdfId); // 👈 force conversion

    const savedChunks = await Chunk.insertMany(
      chunks.map(chunk => ({
        ...chunk,
        pdfId: objectId
      }))
    );

    res.status(201).json({ message: 'Chunks saved', data: savedChunks });
  } catch (err) {
    console.error('Error in saveChunks:', err);
    res.status(500).json({ error: 'Error saving chunks' });
  }
};

// Get all chunks for a PDF
const getChunksByPdf = async (req, res) => {
  try {
    const { pdfId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({ error: 'Invalid PDF ID format' });
    }

    const chunks = await Chunk.find({
      pdfId: new mongoose.Types.ObjectId(pdfId) // 👈 convert here too
    });

    res.json(chunks);
  } catch (err) {
    console.error('Error fetching chunks:', err);
    res.status(500).json({ error: 'Error fetching chunks' });
  }
};

module.exports = { saveChunks, getChunksByPdf };
