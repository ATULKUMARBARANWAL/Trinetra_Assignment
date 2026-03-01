"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString()

interface PdfViewerProps {
  file: File
}

const MemoizedPage = React.memo(Page)

export default function PdfViewer({ file }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pdfRef = useRef<any>(null)

  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [inputPage, setInputPage] = useState("")
  const [baseWidth, setBaseWidth] = useState(800)

  /* ================= Reset On File Change ================= */
  useEffect(() => {
    setPageNumber(1)
    setZoom(1)
    setInputPage("")
    setNumPages(0)
  }, [file])

  /* ================= Fit Width ================= */
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setBaseWidth(containerRef.current.clientWidth - 40)
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  function onDocumentLoadSuccess(pdf: any) {
    pdfRef.current = pdf
    setNumPages(pdf.numPages)
  }

  /* ================= Prefetch Next Page ================= */
  useEffect(() => {
    if (!pdfRef.current) return
    if (pageNumber < numPages) {
      pdfRef.current.getPage(pageNumber + 1)
    }
  }, [pageNumber, numPages])

  /* ================= Keyboard Navigation ================= */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && pageNumber < numPages)
        setPageNumber((p) => p + 1)

      if (e.key === "ArrowLeft" && pageNumber > 1)
        setPageNumber((p) => p - 1)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [pageNumber, numPages])

  /* ================= Drag to Pan ================= */
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isDragging = false
    let startX = 0
    let startY = 0
    let scrollLeft = 0
    let scrollTop = 0

    const mouseDown = (e: MouseEvent) => {
      if (zoom <= 1) return
      isDragging = true
      container.style.cursor = "grabbing"
      startX = e.clientX
      startY = e.clientY
      scrollLeft = container.scrollLeft
      scrollTop = container.scrollTop
    }

    const mouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      container.scrollLeft = scrollLeft - dx
      container.scrollTop = scrollTop - dy
    }

    const mouseUp = () => {
      isDragging = false
      container.style.cursor = zoom > 1 ? "grab" : "default"
    }

    container.addEventListener("mousedown", mouseDown)
    container.addEventListener("mousemove", mouseMove)
    container.addEventListener("mouseup", mouseUp)
    container.addEventListener("mouseleave", mouseUp)

    return () => {
      container.removeEventListener("mousedown", mouseDown)
      container.removeEventListener("mousemove", mouseMove)
      container.removeEventListener("mouseup", mouseUp)
      container.removeEventListener("mouseleave", mouseUp)
    }
  }, [zoom])

  const scaledWidth = useMemo(() => {
    return baseWidth * zoom
  }, [baseWidth, zoom])

  /* ================= Virtualized 3-Page Window ================= */
  const visiblePages = useMemo(() => {
    const pages = []
    if (pageNumber - 1 >= 1) pages.push(pageNumber - 1)
    pages.push(pageNumber)
    if (pageNumber + 1 <= numPages) pages.push(pageNumber + 1)
    return pages
  }, [pageNumber, numPages])

  return (
    <div className="border rounded p-4 space-y-4">

      {/* ================= Zoom Controls ================= */}
      <div className="flex items-center gap-4 justify-center">
        <button
          onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.2))}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          -
        </button>

        <span className="font-semibold text-blue-400">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom((prev) => Math.min(3, prev + 0.2))}
          className="px-3 py-1 bg-gray-700 rounded"
        >
          +
        </button>
      </div>

      {/* ================= Viewer ================= */}
      <div
        ref={containerRef}
        className="overflow-auto h-[95vh] bg-black"
        style={{ cursor: zoom > 1 ? "grab" : "default" }}
      >
        <div style={{ width: scaledWidth, margin: "0 auto", position: "relative" }}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<p className="text-white p-4">Loading PDF...</p>}
            error={<p className="text-red-500 p-4">Failed to load PDF file.</p>}
          >
            {visiblePages.map((page) => (
              <div
                key={page}
                style={{
                  display: page === pageNumber ? "block" : "none",
                }}
              >
                <MemoizedPage
                  pageNumber={page}
                  width={scaledWidth}
                />
              </div>
            ))}
          </Document>
        </div>
      </div>

      {/* ================= Navigation (UNCHANGED) ================= */}
      {numPages > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-4">

          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            Prev
          </button>

          <span className="font-semibold text-blue-400">
            Page {pageNumber} of {numPages}
          </span>

          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber((prev) => prev + 1)}
            className="px-3 py-1 bg-gray-700 rounded"
          >
            Next
          </button>

          <input
            type="number"
            min={1}
            max={numPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            className="w-20 px-2 py-1 bg-gray-800 border rounded"
            placeholder="Page"
          />

          <button
            onClick={() => {
              const page = Number(inputPage)
              if (page >= 1 && page <= numPages) {
                setPageNumber(page)
                setInputPage("")
              }
            }}
            className="px-3 py-1 bg-blue-600 rounded"
          >
            Go
          </button>
        </div>
      )}
    </div>
  )
}