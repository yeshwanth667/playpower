const express = require('express');
const router = express.Router();
const multer=require('multer')
const { uploadPDF, getPDF, getAllPDFs,parseAndChunkPDF  } = require('../controllers/pdfController');

const upload=multer({storage: multer.memoryStorage() })

// @route   POST /api/pdf/upload
router.post('/upload', uploadPDF);
router.post('/parse',upload.single('pdf'), parseAndChunkPDF)

// @route   GET /api/pdf/:id
router.get('/all', getAllPDFs);
router.get('/:id', getPDF);


module.exports = router;
