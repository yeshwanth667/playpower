// import React, { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";
// import "../styles/pdfviewer.css";
// import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

// // ✅ Use local worker file to avoid CORS errors
// pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// export default function PDFViewer({ fileUrl }) {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [containerWidth, setContainerWidth] = useState(600);

//   // Adjust PDF size on window resize
//   useEffect(() => {
//     const updateWidth = () => {
//       const container = document.querySelector(".pdf-document");
//       if (container) {
//         setContainerWidth(container.clientWidth - 20); // Padding adjustment
//       }
//     };
//     updateWidth();
//     window.addEventListener("resize", updateWidth);
//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   // Reset page when new file is loaded
//   useEffect(() => {
//     setPageNumber(1);
//   }, [fileUrl]);

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
//   const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));

//   if (!fileUrl) {
//     return (
//       <div className="text-center text-muted mt-5">
//         No PDF selected. Upload a PDF to start.
//       </div>
//     );
//   }

//   return (
//     <div className="pdf-viewer-container">
//       {/* Controls */}
//       <div className="pdf-controls">
//         <button
//           className="btn btn-outline-primary btn-sm"
//           onClick={goToPrevPage}
//           disabled={pageNumber <= 1}
//         >
//           ‹ Prev
//         </button>
//         <span className="fw-semibold">
//           Page {pageNumber} of {numPages || "…"}
//         </span>
//         <button
//           className="btn btn-outline-primary btn-sm"
//           onClick={goToNextPage}
//           disabled={pageNumber >= numPages}
//         >
//           Next ›
//         </button>
//       </div>

//       {/* PDF Display */}
//       <div className="pdf-document">
//         <Document
//           file={fileUrl}
//           onLoadSuccess={onDocumentLoadSuccess}
//           loading={<div className="text-muted">Loading PDF...</div>}
//         >
//           <Page
//             pageNumber={pageNumber}
//             renderTextLayer={false}
//             renderAnnotationLayer={false}
//             width={containerWidth}
//           />
//         </Document>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../styles/pdfviewer.css";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFViewer({ fileUrl, mode }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1); // zoom level
  const [containerWidth, setContainerWidth] = useState(600);

  useEffect(() => {
    const updateWidth = () => {
      const container = document.querySelector(".pdf-document");
      if (container) {
        setContainerWidth(container.clientWidth - 20);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    setPageNumber(1);
  }, [fileUrl]);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);
  const goToPrevPage = () => setPageNumber((p) => Math.max(p - 1, 1));
  const goToNextPage = () => setPageNumber((p) => Math.min(p + 1, numPages));


  const handleZoomIn = () => {
    setScale(prev => Math.min(1.0, +(prev + 0.1).toFixed(2)));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.3, +(prev - 0.1).toFixed(2)));
  };


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
      <div className="pdf-controls d-flex align-items-center gap-2 mb-2">
        {mode === "page" && (
          <>
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
          </>
        )}

        {/* Zoom Buttons */}
        <button disabled={scale <= 0.3} className="btn btn-outline-secondary btn-sm" onClick={handleZoomOut}>
          ➖ Zoom Out
        </button>
        <button disabled={scale >= 1.0} className="btn btn-outline-secondary btn-sm" onClick={handleZoomIn}>
          ➕ Zoom In
        </button>
        <span style={{ fontSize: "0.85rem" }}>{Math.round(scale * 100)}%</span>
      </div>

      {/* PDF Display */}
      <div className="pdf-document">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="text-muted">Loading PDF...</div>}
        >
          {mode === "scroll"
            ? Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={scale}
                width={containerWidth}
              />
            ))
            : (
              <Page
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={scale}
                width={containerWidth}
              />
            )}
        </Document>
      </div>
    </div>
  );
}


