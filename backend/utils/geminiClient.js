const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

module.exports = genAI;
