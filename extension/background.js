/**
 * background.js
 * Central controller for the Chrome Extension (Manifest V3).
 */

import { getDomainFromTab } from './detector.js';
import { runAudit } from './main.js';

/**
 * Listens for the extension icon click (Action).
 * Triggers the domain extraction, audit process, and broadcasts results.
 */
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // 1. Extract the clean domain name from the active tab
    const domain = getDomainFromTab(tab);

    if (!domain) {
      console.warn('Audit skipped: Invalid or unsupported URL.');
      return;
    }

    // 2. Execute the audit logic defined in main.js
    // runAudit is assumed to be an async function returning the audit data
    const auditResults = await runAudit(domain);

    // 3. Send the processed results to the popup or other extension components
    // We check for listeners to prevent "Uncaught (in promise) Error: Receiving end does not exist"
    chrome.runtime.sendMessage({
      type: 'AUDIT_COMPLETED',
      payload: {
        domain,
        results: auditResults,
        timestamp: Date.now()
      }
    }).catch(err => {
      // It is normal for this to fail if the popup is not currently open
      console.log('Results sent, but no active popup listener found.');
    });

  } catch (error) {
    // Handle unexpected errors during the background workflow
    console.error('Extension Background Error:', error);
    
    chrome.runtime.sendMessage({
      type: 'AUDIT_ERROR',
      error: error.message
    }).catch(() => { /* Ignore failure to send error message */ });
  }
});