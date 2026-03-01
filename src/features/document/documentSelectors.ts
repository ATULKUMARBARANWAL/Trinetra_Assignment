import { RootState } from "@/core/store/rootReducer"

/* =========================================
   All Documents
========================================= */
export const selectDocuments = (state: RootState) =>
  state.document.parsedDocs

/* =========================================
   Active Document ID
========================================= */
export const selectActiveDocumentId = (state: RootState) =>
  state.document.activeDocumentId

/* =========================================
   Active Document Object
========================================= */
export const selectActiveDocument = (state: RootState) => {
  const { parsedDocs, activeDocumentId } = state.document

  return parsedDocs.find((doc) => doc.id === activeDocumentId) || null
}