import React from "react";

export default function ChatMessage({ message }) {
  const isUser = message.isUser || message.question;

  return (
    <div
      className={`d-flex mb-3 ${
        isUser ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        className={`p-3 rounded-3 ${
          isUser ? "bg-primary text-white" : "bg-white border"
        }`}
        style={{ maxWidth: "75%" }}
      >
        {isUser ? message.question || message.text : message.answer}
      </div>
    </div>
  );
}
