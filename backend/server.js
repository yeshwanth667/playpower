const express = require('express');
const connectDB = require('./config/db');
const pdfRoutes=require('./routes/pdfRoutes')
const chunkRoutes=require('./routes/chunkRoutes')
const embeddingRoutes=require('./routes/embeddingRoutes')
const chatRoutes=require('./routes/chatRoutes')
const cors = require('cors');
const path = require("path");
const fs = require("fs");

const app = express();
connectDB(); // Connect MongoDB Atlas

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }))

// Routes here...
app.use('/api/pdf',pdfRoutes)
app.use('/api/chunks',chunkRoutes)
app.use('/api/embed', embeddingRoutes);
app.use('/api/chat',chatRoutes)

app.get("/api/pdf/:id", (req, res) => {
  const pdfPath = path.join(process.cwd(), "uploads", `${req.params.id}.pdf`);
  
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: "PDF not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  fs.createReadStream(pdfPath).pipe(res);
});

app.post("/api/pdf/metadata", async (req, res) => {
  const newPdf = await PdfModel.create(req.body);
  res.json({
    pdf: newPdf,
    fileUrl: `http://localhost:5000/api/pdf/${newPdf._id}`
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
