const express = require('express');
const router = express.Router();
const { saveChunks, getChunksByPdf } = require('../controllers/chunkController');

// POST /api/chunks/save
router.post('/save', saveChunks);

// GET /api/chunks/:pdfId
router.get('/:pdfId', getChunksByPdf);

module.exports = router;
