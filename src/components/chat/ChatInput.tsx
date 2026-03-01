"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/core/store";
import { addMessage, sendMessageThunk } from "@/features/chat/chatSlice";
import { selectActiveDocument } from "@/features/document/documentSelectors";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const activeDoc = useSelector(selectActiveDocument);

  // ✅ Clear input when switching documents
  useEffect(() => {
    setInput("");
  }, [activeDoc?.id]);

  const handleSend = () => {
    if (!input.trim()) return;

    if (!activeDoc) {
      alert("Please select a document first");
      return;
    }

    const userId = Date.now().toString();
    const aiId = userId + "-ai";

    // Add user message
    dispatch(
      addMessage({
        documentId: activeDoc.id,
        message: {
          id: userId,
          role: "user",
          content: input,
          status: "done",
        },
      })
    );

    // Add loading assistant message
    dispatch(
      addMessage({
        documentId: activeDoc.id,
        message: {
          id: aiId,
          role: "assistant",
          content: "",
          status: "loading",
        },
      })
    );

    // Dispatch async AI request (document locked)
    dispatch(
      sendMessageThunk({
        question: input,
        id: aiId,
        documentId: activeDoc.id,
      })
    );

    setInput("");
  };

  return (
    <div className="flex gap-2 p-2 border-t">
      <input
        className="flex-1 p-2 border rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about document..."
      />
      <button
        onClick={handleSend}
        className="px-4 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </div>
  );
}