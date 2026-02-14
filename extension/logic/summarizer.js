/**
 * summarizer.js
 * Logic module for Echo-Audit that generates a simplified explanation 
 * of policy text using local heuristic extraction.
 */

/**
 * Generates a human-readable summary of legal policy text.
 * Designed as an async function to allow for future seamless 
 * integration with Large Language Model (LLM) APIs.
 * * @param {string} text - The raw Terms of Service text.
 * @returns {Promise<string>} A simplified string summary.
 */
export async function generateSummary(text) {
  // 1. Safe handling for missing or empty input
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return "No policy text available.";
  }

  try {
    // 2. Pre-process text: normalize whitespace and split into sentences
    // This regex splits by punctuation followed by space/newline
    const sentences = text
      .trim()
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const summaryParts = [];

    // 3. Extract the first 2 meaningful sentences
    for (const sentence of sentences) {
      if (summaryParts.length >= 2) break;

      // Ignore extremely short sentences (< 5 words)
      const wordCount = sentence.split(/\s+/).length;
      if (wordCount >= 5) {
        summaryParts.push(sentence);
      }
    }

    // 4. Fallback if no meaningful sentences are found
    if (summaryParts.length === 0) {
      return "The policy text provided is too short or lacks structured sentences for analysis.";
    }

    // 5. Join and enforce character limit
    let finalSummary = summaryParts.join(' ');

    if (finalSummary.length > 300) {
      finalSummary = finalSummary.substring(0, 297) + "...";
    }

    return finalSummary;

  } catch (error) {
    // 6. Resilience: Ensure a string is always returned
    console.error('Echo-Audit [summarizer]: Error during summarization', error);
    return "An error occurred while attempting to summarize the policy.";
  }
}