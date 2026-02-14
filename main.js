/**
 * main.js
 * Responsibilities:
 * - Orchestrates the full audit workflow by coordinating logic modules.
 * - Handles the execution flow from detection to final risk assessment.
 */

import { loadBaseline } from './logic/loader.js';
import { fetchCurrent } from './logic/fetcher.js';
import { compareTexts } from './logic/comparator.js';
import { scanRisks } from './logic/riskScanner.js';

export async function runAudit(domain, url) {
  try {
    // 1. Load the stored baseline for the domain
    const baselineText = await loadBaseline(domain);
    
    // 2. Fetch the live text from the URL
    const currentText = await fetchCurrent(url);

    // If fetch fails, return the default failure object
    if (!currentText) {
      throw new Error('Failed to retrieve current ToS text.');
    }

    // 3. Compare baseline vs current
    const comparison = compareTexts(baselineText, currentText);

    // 4. Scan the current text for specific privacy/legal risks
    const riskResults = scanRisks(currentText);

    // 5. Return final structured report
    return {
      changesDetected: comparison.changesDetected,
      changedSections: comparison.changedSections,
      risks: riskResults
    };

  } catch (error) {
    console.error('Echo-Audit Main Execution Error:', error);
    return {
      changesDetected: false,
      changedSections: "",
      risks: []
    };
  }
}