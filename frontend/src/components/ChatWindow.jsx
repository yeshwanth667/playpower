// import React, { useEffect, useState, useRef } from 'react';
// import ReactMarkdown from 'react-markdown';
// import api from '../services/api';
// import Spinner from './Spinner';

// // function Spinner() {
// //   return <span className="spinner" aria-label="Loading"></span>;
// // }

// // function BigLoader() {
// //   return (
// //     <div style={{
// //       textAlign: 'center',
// //       padding: '20px',
// //       fontWeight: 'bold',
// //       color: '#555'
// //     }}>
// //       Loading response...
// //     </div>
// //   );
// // }

// export default function ChatWindow({ pdfId, viewerRef }) {
//   const [question, setQuestion] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (!pdfId) return;
//     api.getChatHistory(pdfId).then((res) => setMessages(res.data));
//   }, [pdfId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleAsk = async () => {
//     if (!question.trim()) return;

//     try {
//       setLoading(true);
//       setError(null)
//       const res = await api.askQuestion(question, pdfId,);
//       setMessages(res.data.history);
//       setQuestion('');
//     } catch (err) {
//       console.error('Failed to get answer:', err);
//       setError('Failed to get answer from the server. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... formatAnswer same as before ...

//   const formatAnswer = (text) => {
//     if (!text) return null;

//     const cleanedText = text
//       .split('\n')
//       .filter(line => !(line.trim() === '' || line.match(/^\d+\.$/)))
//       .join('\n');

//     const parts = cleanedText.split(/(\(p\.\d+\))/g); // split and keep citations
//     return parts.map((part, idx) => {
//       const match = part.match(/\(p\.(\d+)\)/);
//       if (match) {
//         const pageNum = parseInt(match[1], 10);
//         return (
//           <span
//             key={idx}
//             className="text-primary"
//             style={{ cursor: 'pointer', fontWeight: 'bold' }}
//             onClick={() => viewerRef?.current?.scrollToPage(pageNum)}
//           >
//             {part}
//           </span>
//         );
//       }
//       return <ReactMarkdown key={idx}>{part}</ReactMarkdown>;
//     });
//   };

//   return (
//     <div
//       className="d-flex flex-column bg-light"
//       style={{ height: '500px', borderRadius: '8px', border: '1px solid #ccc' }}
//     >
//       <div className="flex-grow-1 p-3 overflow-auto" style={{ borderBottom: '1px solid #ddd' }}>
//         {loading ? (
//           <Spinner />
//         ) : (
//           messages.map((msg, idx) => (
//             <div key={idx} className="mb-3">
//               <div className="fw-bold">Q: {msg.question}</div>
//               <div>A: {formatAnswer(msg.answer)}</div>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}


//       <div className="p-3 bg-white">
//         <div className="input-group">
//           <input
//             type="text"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             className="form-control"
//             placeholder={loading ? 'Waiting for answer...' : 'Ask a question...'}
//             onKeyDown={(e) => e.key === 'Enter' && !loading && handleAsk()}
//             disabled={loading}
//           />
//           <button
//             onClick={handleAsk}
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? <Spinner /> : 'Send'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState, useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import api from "../services/api";
// import Spinner from "./Spinner";

// export default function ChatWindow({ pdfId, viewerRef }) {
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (!pdfId) return;
//     api.getChatHistory(pdfId).then((res) => setMessages(res.data));
//   }, [pdfId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleAsk = async () => {
//     if (!question.trim()) return;

//     try {
//       setLoading(true);
//       setError(null);
//       const res = await api.askQuestion(question, pdfId);
//       setMessages(res.data.history);
//       setQuestion("");
//     } catch (err) {
//       console.error("Failed to get answer:", err);
//       setError("Failed to get answer from the server. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatAnswer = (text) => {
//     if (!text) return null;

//     const cleanedText = text
//       .split("\n")
//       .filter((line) => !(line.trim() === "" || line.match(/^\d+\.$/)))
//       .join("\n");

//     const clickableText = cleanedText.replace(
//       /\(p\.(\d+)\)/g,
//       (match, pageNum) => `[${match}](page:${pageNum})`
//     );

//     return (
//       <ReactMarkdown
//         components={{
//           a: ({ href, children }) => {
//             if (href && href.startsWith("page:")) {
//               const pageNum = parseInt(href.replace("page:", ""), 10);
//               return (
//                 <span
//                   style={{
//                     color: "#0d6efd",
//                     cursor: "pointer",
//                     fontWeight: "bold",
//                   }}
//                   onClick={() => viewerRef?.current?.scrollToPage(pageNum)}
//                 >
//                   {children}
//                 </span>
//               );
//             }
//             return (
//               <a href={href} target="_blank" rel="noopener noreferrer">
//                 {children}
//               </a>
//             );
//           },
//           p: ({ children }) => (
//             <p style={{ margin: "0.4rem 0" }}>{children}</p>
//           ),
//           li: ({ children }) => (
//             <li style={{ marginBottom: "0.3rem" }}>{children}</li>
//           ),
//         }}
//       >
//         {clickableText}
//       </ReactMarkdown>
//     );
//   };

//   const formatTimestamp = (ts) => {
//     try {
//       return new Date(ts).toLocaleString(undefined, {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//       });
//     } catch {
//       return "";
//     }
//   };

//   return (
//     <div
//       className="d-flex flex-column bg-light"
//       style={{ height: "500px", borderRadius: "8px", border: "1px solid #ccc" }}
//     >
//       {/* Messages area */}
//       <div
//         className="flex-grow-1 p-3 overflow-auto"
//         style={{ borderBottom: "1px solid #ddd" }}
//       >
//         {loading && messages.length === 0 ? (
//           <Spinner />
//         ) : (
//           messages.map((msg, idx) => (
//             <div
//               key={idx}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems:
//                   msg.role === "user" ? "flex-end" : "flex-start",
//                 marginBottom: "10px",
//               }}
//             >
//               <div
//                 style={{
//                   background: msg.role === "user" ? "#007bff" : "#f1f0f0",
//                   color: msg.role === "user" ? "#fff" : "#000",
//                   padding: "10px 14px",
//                   borderRadius: "12px",
//                   maxWidth: "100%",
//                   whiteSpace: "pre-wrap",
//                   boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                 }}
//               >
//                 {msg.role === "user"
//                   ? msg.question
//                   : formatAnswer(msg.answer)}
//               </div>
//               {msg.timestamp && (
//                 <span
//                   style={{
//                     fontSize: "0.75rem",
//                     color: "#888",
//                     marginTop: "3px",
//                     textAlign: msg.role === "user" ? "right" : "left",
//                   }}
//                 >
//                   {formatTimestamp(msg.timestamp)}
//                 </span>
//               )}
//             </div>
//           ))
//         )}
//         {loading && messages.length > 0 && (
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-start",
//               marginBottom: "10px",
//             }}
//           >
//             <div
//               style={{
//                 background: "#f1f0f0",
//                 padding: "10px 14px",
//                 borderRadius: "12px",
//                 boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//               }}
//             >
//               <Spinner />
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Error message */}
//       {error && (
//         <div className="alert alert-danger m-2" role="alert">
//           {error}
//         </div>
//       )}

//       {/* Input area */}
//       <div className="p-3 bg-white">
//         <div className="input-group">
//           <input
//             type="text"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             className="form-control"
//             placeholder={
//               loading ? "Waiting for answer..." : "Ask a question..."
//             }
//             onKeyDown={(e) => e.key === "Enter" && !loading && handleAsk()}
//             disabled={loading}
//           />
//           <button
//             onClick={handleAsk}
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? <Spinner /> : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import api from "../services/api";
import Spinner from "./Spinner";

export default function ChatWindow({ pdfId, viewerRef }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!pdfId) return;
    api.getChatHistory(pdfId).then((res) => setMessages(res.data));
  }, [pdfId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const timestamp = new Date().toISOString();

    // Step 1: Show user question immediately
    const newUserMessage = {
      role: "user",
      question,
      timestamp,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      // Step 2: Send question to server
      const res = await api.askQuestion(question, pdfId);

      // Step 3: Append bot answer with timestamp
      const newBotMessage = {
        role: "bot",
        answer: res.data.answer,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err) {
      console.error("Failed to get answer:", err);
      setError("Failed to get answer from the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatAnswer = (text) => {
    if (!text) return null;

    const cleanedText = text
      .split("\n")
      .filter((line) => !(line.trim() === "" || line.match(/^\d+\.$/)))
      .join("\n");

    const clickableText = cleanedText.replace(
      /\(p\.(\d+)\)/g,
      (match, pageNum) => `[${match}](page:${pageNum})`
    );

    return (
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            if (href && href.startsWith("page:")) {
              const pageNum = parseInt(href.replace("page:", ""), 10);
              return (
                <span
                  style={{
                    color: "#0d6efd",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={() => viewerRef?.current?.scrollToPage(pageNum)}
                >
                  {children}
                </span>
              );
            }
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          p: ({ children }) => (
            <p style={{ margin: "0.1rem 0" }}>{children}</p>
          ),
          li: ({ children }) => (
            // <li style={{ marginBottom: "0.3rem" }}>{children}</li>
            <li style={{ marginBottom: "4px", lineHeight: "1.2rem" }}>{children}</li>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: "1.2rem", margin: 0, marginBottom:"0%" }}>{children}</ul>
          ),
        }}
      >
        {clickableText}
      </ReactMarkdown>
    );
  };

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div
      className="d-flex flex-column bg-light"
      style={{ height: "500px", borderRadius: "8px", border: "1px solid #ccc" }}
    >
      {/* Messages area */}
      <div
        className="flex-grow-1 p-3 overflow-auto"
        style={{ borderBottom: "1px solid #ddd" }}
      >
        {loading && messages.length === 0 ? (
          <Spinner />
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: msg.role === "user" ? "#007bff" : "#f1f0f0",
                  color: msg.role === "user" ? "#fff" : "#000",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  maxWidth: "100%",
                  whiteSpace: "pre-wrap",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                {msg.role === "user"
                  ? msg.question
                  : formatAnswer(msg.answer)}
              </div>
              {msg.timestamp && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#000",
                    marginTop: "3px",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  {formatTimestamp(msg.timestamp)}
                </span>
              )}
            </div>
          ))
        )}
        {loading && messages.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                background: "#f1f0f0",
                padding: "10px 14px",
                borderRadius: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Spinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error message */}
      {error && (
        <div className="alert alert-danger m-2" role="alert">
          {error}
        </div>
      )}

      {/* Input area */}
      <div className="p-3 bg-white">
        <div className="input-group">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="form-control"
            placeholder={
              loading ? "Waiting for answer..." : "Ask a question..."
            }
            onKeyDown={(e) => e.key === "Enter" && !loading && handleAsk()}
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}


