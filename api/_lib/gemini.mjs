import { GoogleGenAI } from '@google/genai'

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Model IDs retire. List what your key can reach with:
//   curl "https://generativelanguage.googleapis.com/v1beta/models?key=$GEMINI_API_KEY"
export const DEFAULT_MODEL = 'gemini-3.7-flash'

// Free-tier capacity is shared, so 503s are routine and usually clear in a
// second. 429 is rate limiting, which also benefits from backing off.
const RETRYABLE = new Set([429, 503])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * generateContent with exponential backoff on transient upstream failures.
 * Throws the final error once attempts are exhausted.
 */
export async function generateWithRetry(params, { attempts = 4, baseDelayMs = 500 } = {}) {
  let lastError

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await ai.models.generateContent(params)
    } catch (err) {
      lastError = err
      if (!RETRYABLE.has(err?.status) || attempt === attempts - 1) throw err
      await sleep(baseDelayMs * 2 ** attempt)
    }
  }

  throw lastError
}
