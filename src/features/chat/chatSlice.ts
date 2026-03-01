"use client";

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/core/store/rootReducer";
import { askAI } from "./chatService";
import { saveChat, clearChatStorage } from "@/lib/chatStorage";

/* =========================================
   Types
========================================= */

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  status?: "loading" | "done" | "error";
};

interface ChatState {
  messagesByDocument: Record<string, Message[]>;
}

/* =========================================
   Initial State (SSR SAFE)
========================================= */

const initialState: ChatState = {
  messagesByDocument: {}, // 🔥 always empty (rehydrate later)
};

/* =========================================
   Async Thunk
========================================= */

export const sendMessageThunk = createAsyncThunk<
  { answer: string; id: string; documentId: string },
  { question: string; id: string; documentId: string }
>(
  "chat/sendMessage",
  async ({ question, id, documentId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const document = state.document.parsedDocs.find(
        (doc) => doc.id === documentId
      );

      if (!document) {
        throw new Error("Document not found");
      }

      const context = document.text.slice(0, 2000);

      const response = await askAI(question, context);

      return { answer: response, id, documentId };
    } catch (err: any) {
      return rejectWithValue({
        error: err.message,
        id,
        documentId,
      });
    }
  }
);

/* =========================================
   Slice
========================================= */

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    /* =========================================
       🔥 Rehydrate Chat (IMPORTANT)
    ========================================= */
    setAllChats: (
      state,
      action: PayloadAction<Record<string, Message[]>>
    ) => {
      state.messagesByDocument = action.payload;
    },

    /* =========================================
       Add Message
    ========================================= */
    addMessage: (
      state,
      action: PayloadAction<{ documentId: string; message: Message }>
    ) => {
      const { documentId, message } = action.payload;

      if (!state.messagesByDocument[documentId]) {
        state.messagesByDocument[documentId] = [];
      }

      state.messagesByDocument[documentId].push(message);

      // 🔥 persist
      saveChat(state.messagesByDocument);
    },

    /* =========================================
       Update Message
    ========================================= */
    updateMessage: (
      state,
      action: PayloadAction<{
        documentId: string;
        id: string;
        content: string;
        status: Message["status"];
      }>
    ) => {
      const { documentId, id, content, status } = action.payload;

      const messages = state.messagesByDocument[documentId];
      if (!messages) return;

      const msg = messages.find((m) => m.id === id);
      if (msg) {
        msg.content = content;
        msg.status = status;
      }

      // 🔥 persist
      saveChat(state.messagesByDocument);
    },

    /* =========================================
       Clear Chat for Document
    ========================================= */
    clearChatForDocument: (state, action: PayloadAction<string>) => {
      delete state.messagesByDocument[action.payload];

      // 🔥 persist
      saveChat(state.messagesByDocument);
    },

    /* =========================================
       Reset Chat (Logout)
    ========================================= */
    resetChat: (state) => {
      state.messagesByDocument = {};

      // 🔥 clear storage
      clearChatStorage();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        const { documentId, id, answer } = action.payload;

        const messages = state.messagesByDocument[documentId];
        if (!messages) return;

        const msg = messages.find((m) => m.id === id);
        if (msg) {
          msg.content = answer;
          msg.status = "done";
        }

        // 🔥 persist
        saveChat(state.messagesByDocument);
      })

      .addCase(sendMessageThunk.rejected, (state, action: any) => {
        const { documentId, id, error } = action.payload || {};
        if (!documentId) return;

        const messages = state.messagesByDocument[documentId];
        if (!messages) return;

        const msg = messages.find((m) => m.id === id);
        if (msg) {
          msg.content = error;
          msg.status = "error";
        }

        // 🔥 persist
        saveChat(state.messagesByDocument);
      });
  },
});

/* =========================================
   Exports
========================================= */

export const {
  setAllChats, // 🔥 IMPORTANT
  addMessage,
  updateMessage,
  clearChatForDocument,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;