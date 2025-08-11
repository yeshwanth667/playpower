import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

export default function ChatWindow({ pdfId, viewerRef, setPdfId }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch chat history when pdfId changes
  useEffect(() => {
    if (!pdfId) return;
    api.getChatHistory(pdfId).then((res) => setMessages(res.data));
  }, [pdfId]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      const res = await api.askQuestion(pdfId, question);
      setMessages(res.data.history);
      setQuestion('');
    } catch (err) {
      console.error("Failed to get answer:", err);
      // Optionally show error UI here
    } finally {
      setLoading(false);
    }
  };

  // Format answer text to render markdown and clickable page citations
  const formatAnswer = (text) => {
    if (!text) return null;

    const parts = text.split(/(\(p\.\d+\))/g);

    return parts.map((part, idx) => {
      const match = part.match(/\(p\.(\d+)\)/);
      if (match) {
        const pageNum = parseInt(match[1], 10);
        return (
          <span
            key={idx}
            className="text-primary"
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => viewerRef?.current?.scrollToPage(pageNum)}
          >
            {part}
          </span>
        );
      }
      return <ReactMarkdown key={idx}>{part}</ReactMarkdown>;
    });
  };

  return (
    <div
      className="d-flex flex-column bg-light"
      style={{ height: '500px', borderRadius: '8px', border: '1px solid #ccc' }}
    >
      <div
        className="flex-grow-1 p-3 overflow-auto"
        style={{ borderBottom: '1px solid #ddd' }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-3">
            <div className="fw-bold">Q: {msg.question}</div>
            <div>A: {formatAnswer(msg.answer)}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white">
        <div className="input-group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="form-control"
            placeholder={loading ? "Waiting for answer..." : "Ask a question..."}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleAsk()}
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
