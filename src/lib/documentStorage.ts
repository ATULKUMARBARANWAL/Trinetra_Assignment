const DOC_KEY = "documents";

export const saveDocuments = (docs: any[]) => {
  const safeDocs = docs.map((d) => ({
    id: d.id,
    name: d.name,
    size: d.size,
    pageCount: d.pageCount,
    uploadedAt: d.uploadedAt,
  }));

  localStorage.setItem(DOC_KEY, JSON.stringify(safeDocs));
};

export const loadDocuments = () => {
  return JSON.parse(localStorage.getItem(DOC_KEY) || "[]");
};

export const removeDocumentFromStorage = (id: string) => {
  const docs = loadDocuments();
  const updated = docs.filter((d: any) => d.id !== id);
  saveDocuments(updated);
};