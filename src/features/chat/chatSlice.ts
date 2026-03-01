import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/core/store/rootReducer";
import { askAI } from "./chatService";

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
   Initial State
========================================= */

const initialState: ChatState = {
  messagesByDocument: {},
};

/* =========================================
   Async Thunk (LOCK documentId at dispatch)
========================================= */

export const sendMessageThunk = createAsyncThunk<
  { answer: string; id: string; documentId: string },
  { question: string; id: string; documentId: string }
>(
  "chat/sendMessage",
  async ({ question, id, documentId }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      // ✅ Use parsedDocs (matches your documentSlice)
      const document = state.document.parsedDocs.find(
        (doc) => doc.id === documentId
      );

      if (!document) {
        throw new Error("Document not found");
      }

      // Limit context for performance
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
    addMessage: (
      state,
      action: PayloadAction<{ documentId: string; message: Message }>
    ) => {
      const { documentId, message } = action.payload;

      if (!state.messagesByDocument[documentId]) {
        state.messagesByDocument[documentId] = [];
      }

      state.messagesByDocument[documentId].push(message);
    },

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
    },

    clearChatForDocument: (state, action: PayloadAction<string>) => {
      delete state.messagesByDocument[action.payload];
    },

    // 🔥 NEW: Reset entire chat (for logout)
    resetChat: (state) => {
      state.messagesByDocument = {};
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
      });
  },
});

/* =========================================
   Exports
========================================= */

export const {
  addMessage,
  updateMessage,
  clearChatForDocument,
  resetChat, // 🔥 NEW EXPORT
} = chatSlice.actions;

export default chatSlice.reducer;