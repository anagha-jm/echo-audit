/**
 * summarizer.js
 * Logic module for Echo-Audit that generates a simplified explanation 
 * of policy text using OpenAI API, with a fallback to local heuristic extraction.
 */

// Placeholder for the OpenAI API Key.
// IMPORTANT: Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key.
// Ensure your key has quota available.
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

/**
 * Generates a human-readable summary of legal policy text.
 * Uses OpenAI GPT-4o-mini if available, otherwise falls back to heuristic summary.
 *
 * @param {string} text - The raw Terms of Service text to summarize.
 * @returns {Promise<string>} A simplified string summary.
 */
export async function generateSummary(text) {
  // 1. Safe handling for missing or empty input
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return "No policy text available.";
  }

  // 2. Initial cleanup
  const cleanText = text.trim();

  // 3. Attempt OpenAI Summary
  try {
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY') {
      const summary = await fetchOpenAISummary(cleanText);
      if (summary) return summary;
    } else {
      console.warn('Echo-Audit [summarizer]: OpenAI API Key is missing or default. Usage of heuristic summary.');
    }
  } catch (apiError) {
    console.warn('Echo-Audit [summarizer]: OpenAI API call failed, falling back to heuristic.', apiError);
  }

  // 4. Fallback: Local Heuristic Summary
  return generateHeuristicSummary(cleanText);
}

/**
 * Calls OpenAI API to generate a summary.
 * @param {string} text 
 * @returns {Promise<string|null>} Summary string or null if failed.
 */
async function fetchOpenAISummary(text) {
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  // Truncate text to avoid token limits (max 6000 characters per user request)
  const truncatedText = text.length > 6000 ? text.substring(0, 6000) + "...[truncated]" : text;

  const prompt = `
    You are a legal expert assistant. Summarize the following Terms of Service text in 3-5 clear, simple sentences for a regular user.
    
    Specific Focus Areas:
    1. Highlight any recent policy changes.
    2. Highlight AI training clauses (how user data is used for models).
    3. Highlight data-sharing clauses with third parties.
    4. Explain the risk level for regular users.

    Keep the tone objective and helpful. Do NOT start with "Here is a summary" or similar filler.
    
    Policy Text:
    "${truncatedText}"
  `;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes legal documents." },
        { role: "user", content: prompt }
      ],
      max_tokens: 150, // Enough for 3-5 sentences
      temperature: 0.5
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.choices && data.choices.length > 0 && data.choices[0].message) {
    return data.choices[0].message.content.trim();
  }

  return null;
}

/**
 * Original heuristic validation logic (Fallback).
 * @param {string} text 
 * @returns {string} Sliced summary.
 */
function generateHeuristicSummary(text) {
  try {
    // Pre-process text: normalize whitespace and split into sentences
    // This regex splits by punctuation followed by space/newline
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const summaryParts = [];

    // Extract the first 2 meaningful sentences
    for (const sentence of sentences) {
      if (summaryParts.length >= 2) break;

      // Ignore extremely short sentences (< 5 words)
      const wordCount = sentence.split(/\s+/).length;
      if (wordCount >= 5) {
        summaryParts.push(sentence);
      }
    }

    // Fallback if no meaningful sentences are found
    if (summaryParts.length === 0) {
      return "The policy text provided is too short or lacks structured sentences for analysis (Fallback).";
    }

    // Join and enforce character limit
    let finalSummary = summaryParts.join(' ');

    if (finalSummary.length > 300) {
      finalSummary = finalSummary.substring(0, 297) + "...";
    }

    return finalSummary + " (Auto-generated)";

  } catch (error) {
    console.error('Echo-Audit [summarizer]: Error during heuristic summarization', error);
    return "An error occurred while attempting to summarize the policy.";
  }
}