const genAI = require('../utils/geminiClient')
const Chunk = require('../models/Chunk');
const mongoose = require('mongoose');

const embedChunks = async (req, res) => {
    try {
        const { pdfId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(pdfId)) {
            return res.status(400).json({ error: 'Invalid PDF ID' });
        }

        const model = genAI.getGenerativeModel({ model: 'embedding-001' });
        const chunks = await Chunk.find({ pdfId });

        if (!chunks.length) {
            return res.status(404).json({ error: 'No chunks found for this PDF' });
        }

        const updatedChunks = [];

        for (const chunk of chunks) {
            // ✅ Clean and sanitize content
            const cleanText = chunk.content
                .replace(/https?:\/\/\S+/g, '')           // remove URLs
                .replace(/[^\w\s.,;:!?()-]/g, '')          // remove emojis and special characters
                .replace(/\s+/g, ' ')                      // normalize whitespace
                .trim()
                .slice(0, 100000000);                           // Gemini safe limit (~32k chars, but keep it smaller)

            if (cleanText.length < 10) {
                console.log(`Skipping empty/invalid chunk from page ${chunk.page}`);
                continue;
            }

            const result = await model.embedContent({
                content: {
                    parts: [{ text: cleanText }]
                },
                taskType: 'RETRIEVAL_DOCUMENT',
            });


            const embedding = result.embedding.values;
            chunk.embedding = embedding;
            await chunk.save();
            updatedChunks.push(chunk._id);
        }



        res.json({ message: 'Gemini embeddings generated and saved', updatedChunks });
    } catch (err) {
        console.error('Gemini embedding error:', err);
        res.status(500).json({ error: 'Embedding generation failed' });
    }
};

module.exports = { embedChunks };
