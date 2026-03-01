import { Message } from "@/features/chat/chatSlice";

const CHAT_KEY = "chat_history";

/* =========================================
   Save Chat
========================================= */
export const saveChat = (data: Record<string, Message[]>) => {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving chat", err);
  }
};

/* =========================================
   Load Chat
========================================= */
export const loadChat = (): Record<string, Message[]> => {
  try {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(CHAT_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

/* =========================================
   Clear Chat
========================================= */
export const clearChatStorage = () => {
  localStorage.removeItem(CHAT_KEY);
};