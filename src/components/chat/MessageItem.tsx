"use client";

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Message } from "@/features/chat/chatSlice";

interface Props {
  message: Message;
}

const MessageItem = ({ message }: Props) => {
  // ✅ Memoize rendered content
  const renderedContent = useMemo(() => {
    if (message.status === "loading") {
      return <span>Typing...</span>;
    }

    return <ReactMarkdown>{message.content}</ReactMarkdown>;
  }, [message.content, message.status]);

  return (
    <div
      className={`p-2 ${
        message.role === "user" ? "text-right" : "text-left"
      }`}
    >
      <div className="inline-block bg-gray-800 text-white p-2 rounded">
        {renderedContent}
      </div>
    </div>
  );
};

/**
 * ✅ Custom comparison
 * Prevent re-render unless actual message data changes
 */
export default React.memo(
  MessageItem,
  (prevProps, nextProps) =>
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.message.role === nextProps.message.role
);