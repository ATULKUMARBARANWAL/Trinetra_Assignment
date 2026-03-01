"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/features/chat/chatSlice";

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <div
      className={`p-2 ${
        message.role === "user" ? "text-right" : "text-left"
      }`}
    >
      <div className="inline-block bg-gray-800 text-white p-2 rounded">
        {message.status === "loading" ? (
          <span>Typing...</span>
        ) : (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageItem);