import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import PDFViewer from "../components/PDFViewer";
import ChatWindow from "../components/ChatWindow";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const [pdfId, setPdfId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [mode, setMode] = useState("page"); // "page" or "scroll"

  const handleUploaded = (id, file) => {
    setPdfId(id);
    setPdfUrl(URL.createObjectURL(file)); // For preview without re-fetch
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "page" ? "scroll" : "page"));
  };

  return (
    <div className="app">
      <Navbar mode={mode} toggleMode={toggleMode} />
      <div
        className="container-fluid p-0"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <div
          className="row g-0"
          style={{ height: "100%" }}
        >
          {/* Sidebar: Upload + Chat */}
          <div
            className="col-6 border-end d-flex flex-column"
            style={{ height: "100%" }}
          >
            <div style={{ padding: "1rem" }}>
              <FileUpload onUploaded={handleUploaded} />
            </div>

            {pdfId && (
              <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
                <ChatWindow pdfId={pdfId} />
              </div>
            )}
          </div>

          {/* Main: PDF Viewer */}
          <div
            className="col-6"
            style={{ height: "100%", minHeight: 0, overflow: "hidden" }}
          >
            {pdfUrl ? (
              <div style={{ height: "100%" }}>
                {/* <PDFViewer fileUrl={pdfUrl} /> */}
                <PDFViewer fileUrl={pdfUrl} mode={mode} />
              </div>
            ) : (
              <div className="text-center text-muted mt-5">
                No PDF selected. Upload a PDF to start.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
