const PDF = require('../models/pdf')
const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');
const Chunk=require('../models/Chunk')

const uploadPDF = async (req, res) => {
  try {
    const { filename, uploadedBy, totalPages } = req.body;

    const newPDF = new PDF({ filename, uploadedBy, totalPages });
    await newPDF.save();

    res.status(201).json({ message: 'PDF metadata saved', pdf: newPDF });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
};

const getPDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) return res.status(404).json({ error: 'PDF not found' });
    res.json(pdf);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving PDF' });
  }
};

const getAllPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ uploadDate: -1 }); // newest first
    res.json(pdfs);
  } catch (err) {
    console.error('Error fetching PDFs:', err);
    res.status(500).json({ error: 'Error fetching PDFs' });
  }
};

const parseAndChunkPDF = async (req, res) => {
  try {
    const pdfId = req.body.pdfId;

    console.log("req.file:", req.file);
    console.log("pdfId:", req.body.pdfId);

    if (!req.file || !pdfId) {
      return res.status(400).json({ error: 'PDF file and pdfId required' });
    }

    const data = await pdfParse(req.file.buffer);

    const pages = data.text.split('\n\n'); // Basic split by paragraph
    const chunks = [];

    for (let i = 0; i < pages.length; i++) {
      if (pages[i].trim() !== '') {
        chunks.push({
          page: i + 1,
          content: pages[i],
          pdfId: new mongoose.Types.ObjectId(pdfId),
        });
      }
    }

    const saved = await Chunk.insertMany(chunks);
    res.status(201).json({ message: 'PDF parsed and chunks saved', chunks: saved });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: 'Failed to parse PDF' });
  }
};

module.exports = { uploadPDF, getPDF,getAllPDFs, parseAndChunkPDF };
