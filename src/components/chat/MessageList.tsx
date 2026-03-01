"use client";

import { useSelector } from "react-redux";
import { selectActiveMessages } from "@/features/chat/chatSelectors";
import MessageItem from "./MessageItem";
import { useEffect, useRef } from "react";

export default function MessageList() {
  const messages = useSelector(selectActiveMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}