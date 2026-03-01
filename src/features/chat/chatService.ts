/* =========================================
   AI Chat Service (FINAL STABLE VERSION)
   - No duplicate answers
   - Better keyword matching
   - Dynamic for any PDF
   - Clean output
========================================= */

type Chunk = {
  id: number
  text: string
}

/* =========================================
   MAIN FUNCTION
========================================= */

export const askAI = async (question: string, context: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      if (!context || context.trim().length === 0) {
        resolve("No document content available.")
        return
      }

      const normalized = normalizeText(context)

      const keywords = expandKeywords(extractKeywords(question))

      if (keywords.length === 0) {
        resolve("Please ask a more specific question.")
        return
      }

      const chunks = splitIntoChunks(normalized)

      const ranked = rankChunks(chunks, keywords)

      if (ranked.length === 0) {
        resolve("No relevant information found.")
        return
      }

      const answer = extractBestContent(ranked, keywords)

      resolve(answer)
    }, 80)
  })
}

/* =========================================
   NORMALIZE TEXT
========================================= */

function normalizeText(text: string) {
  return text
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/•/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/* =========================================
   SPLIT INTO CHUNKS
========================================= */

function splitIntoChunks(text: string): Chunk[] {
  const words = text.split(" ")
  const size = 120

  const chunks: Chunk[] = []
  let id = 0

  for (let i = 0; i < words.length; i += size) {
    const chunk = words.slice(i, i + size).join(" ")

    if (chunk.length > 50) {
      chunks.push({ id: id++, text: chunk })
    }
  }

  return chunks
}

/* =========================================
   KEYWORD EXTRACTION
========================================= */

function extractKeywords(question: string) {
  const stopWords = [
    "what","is","the","a","an","about","tell","me",
    "of","in","on","for","explain","describe","give",
    "details","information","please","this","that"
  ]

  return question
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.includes(w))
}

/* =========================================
   KEYWORD EXPANSION
========================================= */

function expandKeywords(keywords: string[]) {
  const synonyms: Record<string, string[]> = {
    api: ["request","endpoint","fetch"],
    auth: ["login","token","authentication"],
    performance: ["speed","optimization","fast"],
    error: ["fail","issue","problem"],
    data: ["information","records","details"],
    user: ["client","person"],
    system: ["application","platform"],
    project: ["work","build","develop"]
  }

  const expanded = [...keywords]

  keywords.forEach(k => {
    if (synonyms[k]) {
      expanded.push(...synonyms[k])
    }
  })

  return expanded
}

/* =========================================
   WORD MATCH (STRICT)
========================================= */

function matchWord(text: string, word: string) {
  const regex = new RegExp(`\\b${word}\\b`, "i")
  return regex.test(text)
}

/* =========================================
   SCORE CALCULATION
========================================= */

function calculateScore(text: string, keywords: string[]) {
  let score = 0

  keywords.forEach(word => {
    if (matchWord(text, word)) {
      score += 10
    }
  })

  return score
}

/* =========================================
   RANK CHUNKS (IMPROVED)
========================================= */

function rankChunks(chunks: Chunk[], keywords: string[]) {
  return chunks
    .map(chunk => ({
      ...chunk,
      score: calculateScore(chunk.text, keywords)
    }))
    .filter(c => c.score >= 10) // 🔥 strict filtering
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // more options
}

/* =========================================
   EXTRACT BEST CONTENT (NO DUPLICATES)
========================================= */

function extractBestContent(
  ranked: { id: number; text: string; score: number }[],
  keywords: string[]
) {
  const seen = new Set<string>()
  const results: string[] = []

  for (const r of ranked) {
    const sentences = r.text.split(/[.!?]/)

    for (const sentence of sentences) {
      const cleanSentence = sentence.trim()

      if (cleanSentence.length < 30) continue

      let matchCount = 0

      keywords.forEach(word => {
        if (matchWord(cleanSentence, word)) {
          matchCount++
        }
      })

      if (matchCount >= 1) {
        const normalized = cleanSentence.toLowerCase()

        if (!seen.has(normalized)) {
          seen.add(normalized)
          results.push(clean(cleanSentence))
        }
      }

      if (results.length >= 3) break
    }

    if (results.length >= 3) break
  }

  if (results.length === 0) {
    return "No relevant information found."
  }

  return results
    .map(r => "• " + r)
    .join("\n\n")
}

/* =========================================
   CLEAN TEXT
========================================= */

function clean(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/[^\w\s.,()-]/g, "")
    .trim()
}