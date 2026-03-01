import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/* =========================================
   Types
========================================= */

export interface ParsedDocument {
  id: string
  name: string
  size: number
  pageCount: number
  uploadedAt: number
  text: string // 🔥 ADD THIS (for chat)
}

interface DocumentState {
  parsedDocs: ParsedDocument[]
  activeDocumentId: string | null // 🔥 ADD THIS
  isProcessing: boolean
  error: string | null
}

/* =========================================
   Initial State
========================================= */

const initialState: DocumentState = {
  parsedDocs: [],
  activeDocumentId: null,
  isProcessing: false,
  error: null,
}

/* =========================================
   Slice
========================================= */

const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    /* ================================
       Remove Document
    ================================= */
    removeFile: (state, action: PayloadAction<string>) => {
      state.parsedDocs = state.parsedDocs.filter(
        (doc) => doc.id !== action.payload
      )

      // 🔥 if active removed
      if (state.activeDocumentId === action.payload) {
        state.activeDocumentId = null
      }
    },

    /* ================================
       Set Active Document
    ================================= */
    setActiveDocument: (state, action: PayloadAction<string>) => {
      state.activeDocumentId = action.payload
    },

    /* ================================
       Processing State
    ================================= */
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },

    /* ================================
       Add Parsed Document
    ================================= */
    addParsedDoc: (state, action: PayloadAction<ParsedDocument>) => {
      state.parsedDocs.push(action.payload)

      // 🔥 auto set active if first file
      if (!state.activeDocumentId) {
        state.activeDocumentId = action.payload.id
      }
    },

    /* ================================
       Error Handling
    ================================= */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    /* ================================
       Clear All Documents
    ================================= */
    clearDocuments: (state) => {
      state.parsedDocs = []
      state.activeDocumentId = null
      state.error = null
      state.isProcessing = false
    },

    /* ================================
       🔥 NEW: Reset Documents (for logout)
    ================================= */
    resetDocuments: (state) => {
      state.parsedDocs = []
      state.activeDocumentId = null
      state.error = null
      state.isProcessing = false
    },
  },
})

export const {
  removeFile,
  setProcessing,
  addParsedDoc,
  setError,
  clearDocuments,
  setActiveDocument,
  resetDocuments, // 🔥 NEW EXPORT
} = documentSlice.actions

export default documentSlice.reducer