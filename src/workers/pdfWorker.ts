/// <reference lib="webworker" />

import * as pdfjsLib from "pdfjs-dist"
import "pdfjs-dist/build/pdf.worker.mjs"

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

self.onmessage = async (event: MessageEvent) => {
  const { file, fileMeta } = event.data

  try {
    const arrayBuffer = await file.arrayBuffer()

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise

    let fullText = ""

    // 🔥 Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i)

  const textContent = await page.getTextContent()

  const pageText = textContent.items
    .map((item: any) => item.str)
    .join(" ")

  fullText += `\n\nPage ${i}\n${pageText}`
}

    self.postMessage({
      success: true,
      data: {
        pageCount: pdf.numPages,
        text: fullText, // ✅ IMPORTANT
      },
      fileMeta,
    })
  } catch (error) {
    console.error("Worker Error:", error)

    self.postMessage({
      success: false,
      error: String(error),
    })
  }
}