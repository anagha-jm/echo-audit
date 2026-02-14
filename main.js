/**
 * main.js
 * Orchestrates the full Echo-Audit workflow.
 * This script coordinates baseline loading, live text fetching, 
 * change comparison, risk scanning, and summarization.
 */

import { loadBaseline } from '../logic/loader.js';
import { fetchCurrent } from '../logic/fetcher.js';
import { compareTexts } from '../logic/comparator.js';
import { scanRisks } from '../logic/riskScanner.js';
import { generateSummary } from '../logic/summarizer.js';

/**
 * Runs the full audit process for a given domain.
 * @param {string} domain - The cleaned domain name (e.g., "google.com")
 * @param {number} tabId - The ID of the tab to audit.
 * @returns {Promise<Object>} The final audit report for the UI.
 */
export async function runAudit(domain, tabId) {
  try {
    // 1. Load the previously saved version of the ToS from storage
    const baselineText = await loadBaseline(domain);

    // 2. Request the current visible text from the content script
    const currentText = await fetchCurrent(tabId);

    if (!currentText) {
      throw new Error('Failed to retrieve current page text. Ensure the page is fully loaded.');
    }

    // 3. Compare the current text against the baseline to check for updates
    const comparison = compareTexts(baselineText, currentText);

    // 4. Analyze the current text for privacy and legal risk keywords
    const riskResults = scanRisks(currentText);

    // 5. Generate a simplified human-readable summary
    const summary = await generateSummary(currentText);

    // 6. Update the baseline in storage for the next time this site is visited
    // This ensures 'changesDetected' works accurately on the next run.
    await chrome.storage.local.set({ [domain]: currentText });

    // 7. Determine the overall Severity Level
    let severity = "Safe";
    if (riskResults.risks.length >= 3) {
      severity = "Danger";
    } else if (riskResults.risks.length > 0) {
      severity = "Warning";
    }

    // 8. Return the final structured report to background.js
    return {
      domain: domain,
      changesDetected: comparison.changesDetected,
      risks: riskResults.risks, // Array of categories (AI, TRACKING, etc.)
      severity: severity,
      summary: summary,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Echo-Audit [main.js] Error:', error);

    // Return a safe error state so the UI doesn't break
    return {
      domain: domain || 'Unknown',
      changesDetected: false,
      risks: [],
      severity: "Error",
      summary: `Audit failed: ${error.message}`
    };
  }
}