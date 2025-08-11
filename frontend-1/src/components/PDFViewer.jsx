import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../styles/pdfviewer.css";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// ✅ Use local worker file to avoid CORS errors
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(600);

  // Adjust PDF size on window resize
  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector(".pdf-document");
      if (container) {
        setContainerWidth(container.clientWidth - 20); // Padding adjustment
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Reset page when new file is loaded
  useEffect(() => {
    setPageNumber(1);
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

  if (!fileUrl) {
    return (
      <div className="text-center text-muted mt-5">
        No PDF selected. Upload a PDF to start.
      </div>
    );
  }

  return (
    <div className="pdf-viewer-container">
      {/* Controls */}
      <div className="pdf-controls">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={goToPrevPage}
          disabled={pageNumber <= 1}
        >
          ‹ Prev
        </button>
        <span className="fw-semibold">
          Page {pageNumber} of {numPages || "…"}
        </span>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={goToNextPage}
          disabled={pageNumber >= numPages}
        >
          Next ›
        </button>
      </div>

      {/* PDF Display */}
      <div className="pdf-document">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-muted">Loading PDF...</div>}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            width={containerWidth}
          />
        </Document>
      </div>
    </div>
  );
}
