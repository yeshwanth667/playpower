// src/components/FileUpload.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function FileUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setError("");
    setFile(e.target.files[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // 1) Create metadata entry (you can expand metadata fields)
      const metaRes = await api.createPdfMetadata({
        filename: file.name,
        uploadedBy: "frontend-user",
        totalPages: 0, // optional, backend can update after parsing
      });

      const pdf = metaRes.data.pdf ?? metaRes.data; // handle different response shapes
      const pdfId = pdf._id || pdf.id;

      // 2) Send the actual file to parse endpoint with pdfId
      await api.parsePdfFile(file, pdfId, (evt) => {
        if (evt.total) {
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      });

      setUploading(false);
      setFile(null);
      setProgress(0);
      setError("");

      // call parent with the created pdfId
      if (onUploaded) onUploaded(pdfId,file);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err?.response?.data?.error || "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="p-3 border rounded mb-3 bg-white">
      <h6 className="mb-2">Upload PDF</h6>

      <div className="mb-2">
        <input
          type="file"
          accept="application/pdf"
          className="form-control"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {file && (
        <div className="mb-2 small text-muted">
          Selected: <strong>{file.name}</strong> ({Math.round(file.size / 1024)} KB)
        </div>
      )}

      {uploading && (
        <div className="mb-2">
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger py-1">{error}</div>}

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? "Uploading..." : "Upload & Parse"}
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => { setFile(null); setError(""); }}
          disabled={uploading}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
