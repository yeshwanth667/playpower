import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

function Spinner() {
  return <span className="spinner" aria-label="Loading"></span>;
}

function BigLoader() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      fontWeight: 'bold',
      color: '#555'
    }}>
      Loading response...
    </div>
  );
}

export default function ChatWindow({ pdfId, viewerRef }) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!pdfId) return;
    api.getChatHistory(pdfId).then((res) => setMessages(res.data));
  }, [pdfId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      const res = await api.askQuestion( question,pdfId,);
      setMessages(res.data.history);
      setQuestion('');
    } catch (err) {
      console.error('Failed to get answer:', err);
    } finally {
      setLoading(false);
    }
  };

  // ... formatAnswer same as before ...

   const formatAnswer = (text) => {
    if (!text) return null;

    const cleanedText = text
    .split('\n')
    .filter(line => !(line.trim() === '' || line.match(/^\d+\.$/)))
    .join('\n');

    const parts = cleanedText.split(/(\(p\.\d+\))/g); // split and keep citations
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
        {loading ? (
          <BigLoader />
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="mb-3">
              <div className="fw-bold">Q: {msg.question}</div>
              <div>A: {formatAnswer(msg.answer)}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white">
        <div className="input-group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="form-control"
            placeholder={loading ? 'Waiting for answer...' : 'Ask a question...'}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleAsk()}
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
