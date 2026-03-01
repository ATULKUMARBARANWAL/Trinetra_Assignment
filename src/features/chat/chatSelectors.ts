import { RootState } from "@/core/store/rootReducer";
import { selectActiveDocument } from "../document/documentSelectors";

export const selectActiveMessages = (state: RootState) => {
  const activeDoc = selectActiveDocument(state);
  if (!activeDoc) return [];

  return state.chat.messagesByDocument[activeDoc.id] ?? [];
};