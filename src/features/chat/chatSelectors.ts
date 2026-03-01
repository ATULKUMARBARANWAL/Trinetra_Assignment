import { RootState } from "@/core/store/rootReducer";
import { selectActiveDocument } from "../document/documentSelectors";

/* =========================================
   Active Messages Selector (FINAL FIX)
========================================= */

export const selectActiveMessages = (state: RootState) => {
  const activeDoc = selectActiveDocument(state);
  const messagesByDoc = state.chat.messagesByDocument;

  // ✅ If active document exists → ALWAYS use it
  if (activeDoc) {
    return messagesByDoc[activeDoc.id] ?? [];
  }

  // 🔥 Only fallback when NO active document (after refresh)
  const firstDocId = Object.keys(messagesByDoc)[0];

  if (firstDocId) {
    return messagesByDoc[firstDocId];
  }

  return [];
};