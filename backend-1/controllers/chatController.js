const genAI = require('../utils/geminiClient');
const Chunk = require('../models/Chunk');
const ChatHistory = require('../models/ChatHistory');
const mongoose = require('mongoose');

// Utility: Cosine similarity
const cosineSimilarity = (vecA, vecB) => {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

// controllers/chatController.js
const getChatHistory = async (req, res) => {
  try {
    const { pdfId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({ error: 'Invalid PDF ID' });
    }

    // Fetch chat history sorted by oldest first
    const history = await ChatHistory.find({ pdfId })
      .sort({ createdAt: 1 }); 

    res.json(history);
  } catch (err) {
    console.error('Get chat history error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};


// module.exports = { askQuestion, getChatHistory };




// const askQuestion = async (req, res) => {
//   try {
//     const { question, pdfId } = req.body;

//     if (!question || !pdfId || !mongoose.Types.ObjectId.isValid(pdfId)) {
//       return res.status(400).json({ error: 'Valid question and pdfId required' });
//     }

//     // 1️⃣ Embed the question
//     const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
//     const embeddingResult = await embeddingModel.embedContent({
//       content: { parts: [{ text: question }] },
//       taskType: 'RETRIEVAL_QUERY',
//     });
//     const questionEmbedding = embeddingResult.embedding.values;

//     // 2️⃣ Find matching chunks
//     const chunks = await Chunk.find({ pdfId, embedding: { $exists: true } });
//     if (!chunks.length) return res.status(404).json({ error: 'No embedded chunks found' });

//     const rankedChunks = chunks.map(chunk => ({
//       chunk,
//       score: cosineSimilarity(questionEmbedding, chunk.embedding),
//     })).sort((a, b) => b.score - a.score);

//     const topChunks = rankedChunks.slice(0, 3).map(c => c.chunk);
//     const contextText = topChunks.map(c => `Page ${c.page}: ${c.content}`).join('\n\n');

//     // 3️⃣ Ask Gemini
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
//     const result = await model.generateContentStream({
//       contents: [
//         {
//           role: 'user',
//           parts: [
//             { text: `Use the following PDF content to answer the question.\n\n${contextText}\n\nQuestion: ${question}` },
//           ],
//         },
//       ],
//     });

//     // 4️⃣ Collect the full answer from stream
//     let fullAnswer = '';
//     for await (const chunk of result.stream) {
//       if (chunk.text()) {
//         fullAnswer += chunk.text();
//       }
//     }

//     // 5️⃣ Save to DB
//     await ChatHistory.create({
//       pdfId,
//       question,
//       answer: fullAnswer
//     });

//     // 6️⃣ Fetch updated history
//     const history = await ChatHistory.find({ pdfId }).sort({ createdAt: 1 });

//     // 7️⃣ Send back both answer + history
//     res.json({
//       answer: fullAnswer.replace(/\n{2,}/g, '\n\n'),
//       history
//     });

//   } catch (err) {
//     console.error('Gemini QA error:', err);
//     res.status(500).json({ error: 'Failed to generate answer' });
//   }
// };

const askQuestion = async (req, res) => {
  try {
    const { question, pdfId } = req.body;

    console.log('>>>>Sending to backend:', { pdfId, question });


    if (!question || !pdfId || !mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({ error: 'Valid question and pdfId required' });
    }

    // 1️⃣ Embed the question
    const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
    const embeddingResult = await embeddingModel.embedContent({
      content: { parts: [{ text: question }] },
      taskType: 'RETRIEVAL_QUERY',
    });
    const questionEmbedding = embeddingResult.embedding.values;

    // 2️⃣ Find matching chunks
    const chunks = await Chunk.find({ pdfId, embedding: { $exists: true } });
    if (!chunks.length) return res.status(404).json({ error: 'No embedded chunks found' });

    const rankedChunks = chunks.map(chunk => ({
      chunk,
      score: cosineSimilarity(questionEmbedding, chunk.embedding),
    })).sort((a, b) => b.score - a.score);

    const topChunks = rankedChunks.slice(0, 3).map(c => c.chunk);
    const contextText = topChunks.map(c => `Page ${c.page}: ${c.content}`).join('\n\n');

    // 3️⃣ Ask Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const result = await model.generateContentStream({
      contents: [
        {
          role: 'user',
          parts: [
            { text: `Use the following PDF content to answer the question.\n\n${contextText}\n\nQuestion: ${question}` },
          ],
        },
      ],
    });

    // 4️⃣ Collect the full answer from stream
    let fullAnswer = '';
    for await (const chunk of result.stream) {
      if (chunk.text()) {
        fullAnswer += chunk.text();
      }
    }

    // ✅ Clean answer: preserve paragraphs & bullet points
    const cleanedAnswer = fullAnswer
      .replace(/\r/g, '') // remove carriage returns
      .replace(/\n{3,}/g, '\n\n') // collapse >2 newlines into 2
      .trim();

    // 5️⃣ Save to DB
    await ChatHistory.create({
      pdfId,
      question,
      answer: cleanedAnswer
    });

    // 6️⃣ Fetch updated history
    const history = await ChatHistory.find({ pdfId }).sort({ createdAt: 1 });

    // 7️⃣ Send back both answer + history
    res.json({
      answer: cleanedAnswer,
      history
    });

  } catch (err) {
    console.error('Gemini QA error:', err);
    res.status(500).json({ error: 'Failed to generate answer' });
  }
};

const deleteChatHistory = async (req, res) => {
  try {
    const { pdfId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(pdfId)) {
      return res.status(400).json({ error: 'Invalid PDF ID' });
    }

    const result = await ChatHistory.deleteMany({ pdfId });

    res.json({
      message: `Deleted ${result.deletedCount} chat history records for this PDF.`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error('Delete chat history error:', err);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
};

const deleteChatMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    const deleted = await ChatHistory.findByIdAndDelete(messageId);

    if (!deleted) {
      return res.status(404).json({ error: 'Chat message not found' });
    }

    res.json({ message: 'Chat message deleted successfully', deleted });
  } catch (err) {
    console.error('Delete single chat message error:', err);
    res.status(500).json({ error: 'Failed to delete chat message' });
  }
};





module.exports = { askQuestion,getChatHistory,deleteChatHistory,deleteChatMessage };
