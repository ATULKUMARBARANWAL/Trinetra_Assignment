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
  text: string
}

interface DocumentState {
  parsedDocs: ParsedDocument[]
  activeDocumentId: string | null
  isProcessing: boolean
  error: string | null
}

/* =========================================
   LocalStorage Helpers
========================================= */

const DOC_KEY = "documents"

// 🔥 Save documents (without heavy text if needed)
const saveDocuments = (docs: ParsedDocument[]) => {
  try {
    const safeDocs = docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      size: doc.size,
      pageCount: doc.pageCount,
      uploadedAt: doc.uploadedAt,
      text: doc.text, // keep if needed for chat
    }))

    localStorage.setItem(DOC_KEY, JSON.stringify(safeDocs))
  } catch (err) {
    console.error("Error saving documents", err)
  }
}

// 🔥 Load documents
const loadDocuments = (): ParsedDocument[] => {
  try {
    if (typeof window === "undefined") return []

    const data = localStorage.getItem(DOC_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

/* =========================================
   Initial State (rehydrate)
========================================= */

const initialState: DocumentState = {
  parsedDocs: typeof window !== "undefined" ? loadDocuments() : [],
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

      if (state.activeDocumentId === action.payload) {
        state.activeDocumentId = null
      }

      // 🔥 persist
      saveDocuments(state.parsedDocs)
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

      if (!state.activeDocumentId) {
        state.activeDocumentId = action.payload.id
      }

      // 🔥 persist
      saveDocuments(state.parsedDocs)
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

      // 🔥 clear storage
      localStorage.removeItem(DOC_KEY)
    },

    /* ================================
       Reset Documents (for logout)
    ================================= */
    resetDocuments: (state) => {
      state.parsedDocs = []
      state.activeDocumentId = null
      state.error = null
      state.isProcessing = false

      // 🔥 clear storage
      localStorage.removeItem(DOC_KEY)
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
  resetDocuments,
} = documentSlice.actions

export default documentSlice.reducer