const express = require('express');
const router = express.Router();
const { askQuestion,getChatHistory,deleteChatHistory,deleteChatMessage } = require('../controllers/chatController');

router.post('/ask', askQuestion);
router.get('/history/:pdfId', getChatHistory);
router.delete('/history/:pdfId', deleteChatHistory);
router.delete('/message/:messageId', deleteChatMessage);

module.exports = router;
