import path from "path";
import fs from "fs";

export const parsePdfFile = async (req, res) => {
  try {
    const pdfId = req.params.pdfId;
    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, `${pdfId}.pdf`);
    fs.renameSync(req.file.path, filePath);

    res.json({ message: "PDF uploaded successfully", pdfId });
  } catch (err) {
    console.error("Error saving PDF:", err);
    res.status(500).json({ error: "Failed to save PDF" });
  }
};
