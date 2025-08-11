const express = require('express');
const router = express.Router();
const { embedChunks } = require('../controllers/embeddingController');

router.post('/embed/:pdfId', embedChunks);

module.exports = router;
