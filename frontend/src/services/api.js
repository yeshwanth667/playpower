// src/services/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  // You may need to allow credentials if using cookies auth:
  // withCredentials: true,
});

export const askQuestion = (question,pdfId ) =>
  API.post("/chat/ask", { question,pdfId });

export const getChatHistory = (pdfId) =>
  API.get(`/chat/history/${pdfId}`);

// Create PDF metadata (returns pdf object with _id)
export const createPdfMetadata = ({ filename, uploadedBy = "user", totalPages = 0 }) =>
  API.post("/pdf/upload", { filename, uploadedBy, totalPages });

// Upload file + parse: send form-data (pdf file + pdfId)
export const parsePdfFile = (file, pdfId, onUploadProgress) => {
  const fd = new FormData();
  fd.append("pdf", file);      // field name must match multer.single('pdf')
  fd.append("pdfId", pdfId);

  return API.post("/pdf/parse", fd, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

// optional: list all pdfs
export const getAllPdfs = () => API.get("/pdf/all");

export default {
  askQuestion,
  getChatHistory,
  createPdfMetadata,
  parsePdfFile,
  getAllPdfs,
};
