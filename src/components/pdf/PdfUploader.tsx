"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { RootState } from "@/core/store/rootReducer";
import { toast } from "react-toastify";
import {
  setError,
  addParsedDoc,
  setProcessing,
  removeFile,
  setActiveDocument,
} from "@/features/document/documentSlice";

import {
  selectActiveDocumentId,
  selectDocuments,
} from "@/features/document/documentSelectors";

import PdfViewer from "./PdfViewer";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function PdfUploader() {
  const dispatch = useDispatch();

  /* =========================================
     Selectors (optimized)
  ========================================= */

  const parsedDocs = useSelector(selectDocuments, shallowEqual);
  const activeDocumentId = useSelector(selectActiveDocumentId);
  const { error, isProcessing } = useSelector(
    (state: RootState) => ({
      error: state.document.error,
      isProcessing: state.document.isProcessing,
    }),
    shallowEqual
  );

  /* =========================================
     Refs
  ========================================= */

  const workerRef = useRef<Worker | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* =========================================
     Local State (file objects only)
  ========================================= */

  const [localFiles, setLocalFiles] = useState<
    { id: string; file: File }[]
  >([]);

  /* =========================================
     Worker Setup (only once)
  ========================================= */

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@/workers/pdfWorker.ts", import.meta.url)
    );

    workerRef.current.onmessage = (event) => {
      const { success, data, error, fileMeta } = event.data;

      if (success) {
        dispatch(
          addParsedDoc({
            id: fileMeta.id,
            name: fileMeta.name,
            size: fileMeta.size,
            pageCount: data.pageCount,
            uploadedAt: Date.now(),
            text: data.text || "",
          })
        );

        dispatch(setActiveDocument(fileMeta.id));
      } else {
        dispatch(setError(error));
      }

      dispatch(setProcessing(false));
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [dispatch]);

  /* =========================================
     File Validation
  ========================================= */

  const validateFiles = useCallback(
    (files: FileList | null): File[] => {
      if (!files) return [];

      const valid: File[] = [];

      Array.from(files).forEach((file) => {
        if (file.type !== "application/pdf") {
          dispatch(setError("Only PDF files are allowed"));
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.info("Large file detected. Processing may take a moment ⏳")
        }

        valid.push(file);
      });

      return valid;
    },
    [dispatch]
  );

  /* =========================================
     Handle Files
  ========================================= */

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const validFiles = validateFiles(files);
      if (validFiles.length === 0) return;

      dispatch(setError(null));
      dispatch(setProcessing(true));

      validFiles.forEach((file) => {
const id =
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        setLocalFiles((prev) => [...prev, { id, file }]);

        workerRef.current?.postMessage({
          file,
          fileMeta: {
            id,
            name: file.name,
            size: file.size,
          },
        });
      });
    },
    [dispatch, validateFiles]
  );

  /* =========================================
     Remove File
  ========================================= */

  const handleRemove = useCallback(
    (docId: string) => {
      dispatch(removeFile(docId));
      setLocalFiles((prev) =>
        prev.filter((file) => file.id !== docId)
      );
    },
    [dispatch]
  );

  /* =========================================
     Active File Memoized
  ========================================= */

  const activeFile = useMemo(() => {
    return localFiles.find(
      (file) => file.id === activeDocumentId
    );
  }, [localFiles, activeDocumentId]);

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="p-6 border border-gray-800 rounded-xl space-y-6 bg-gray-900/40">

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="p-10 border-2 border-dashed border-gray-600 rounded-xl text-center cursor-pointer hover:border-blue-500 hover:bg-gray-800/40 transition"
      >
        <p className="text-lg font-semibold">
          Drag & drop PDF files here
        </p>
        <p className="text-sm text-gray-400 mt-2">
          or click anywhere to browse
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded">
          {error}
        </div>
      )}

      {/* Processing */}
      {isProcessing && (
        <div className="text-blue-400 text-sm bg-blue-900/20 p-3 rounded">
          Processing PDF...
        </div>
      )}

      {/* File List */}
      {parsedDocs.length > 0 && (
        <div className="space-y-3">
          {parsedDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => dispatch(setActiveDocument(doc.id))}
              className={`flex justify-between items-center border p-4 rounded-lg cursor-pointer transition ${
                doc.id === activeDocumentId
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <div>
                <p className="font-medium">{doc.name}</p>
                <p className="text-xs text-gray-400">
                  {(doc.size / 1024 / 1024).toFixed(2)} MB •{" "}
                  {doc.pageCount} pages
                </p>
              </div>

              <button
                className="text-red-400 text-sm hover:text-red-300 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(doc.id);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PDF Viewer */}
     {activeDocumentId && activeFile && (
  <div className="mt-6">
    <PdfViewer key={activeFile.id} file={activeFile.file} />
  </div>
)}

{activeDocumentId && !activeFile && (
  <div className="mt-6 p-4 border border-yellow-600 rounded text-yellow-400">
    PDF not available. Please re-upload the file to view.
  </div>
)}
    </div>
  );
}