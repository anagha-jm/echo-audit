/**
 * riskScanner.js
 * Logic module for Echo-Audit that identifies potential privacy and legal risks
 * within Terms of Service text using keyword categorization.
 */

/**
 * Predefined risk categories and their associated trigger keywords.
 * Keywords are lowercased for case-insensitive matching.
 */
const RISK_MAP = {
  AI: ["ai training", "machine learning", "model improvement"],
  DATA_SHARING: ["third party", "partners", "sell data", "share your data"],
  TRACKING: ["tracking", "cookies", "analytics"],
  BIOMETRIC: ["biometric", "face recognition", "fingerprint"]
};

/**
 * Scans a string of text for predefined risk categories based on keywords.
 * * @param {string} text - The raw text content to analyze.
 * @returns {Object} An object containing the list of detected risk categories and specific keyword matches.
 */
export function scanRisks(text) {
  // 1. Safe handling for null, undefined, or non-string inputs
  const result = {
    risks: [],
    matches: {}
  };

  if (!text || typeof text !== 'string') {
    return result;
  }

  try {
    const content = text.toLowerCase();

    // 2. Iterate through each risk category
    for (const [category, keywords] of Object.entries(RISK_MAP)) {
      const detectedKeywords = [];

      // 3. Check for partial, case-insensitive matches for each keyword
      for (const keyword of keywords) {
        if (content.includes(keyword.toLowerCase())) {
          detectedKeywords.push(keyword);
        }
      }

      // 4. If any keywords were found, populate the result object
      if (detectedKeywords.length > 0) {
        result.risks.push(category);
        result.matches[category] = detectedKeywords;
      }
    }
  } catch (error) {
    // 5. Catch-all to ensure the extension never crashes during analysis
    console.error('Echo-Audit [riskScanner]: Analysis failed', error);
  }

  return result;
}