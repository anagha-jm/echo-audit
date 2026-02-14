/**
 * background.js
 * Central controller for the Chrome Extension (Manifest V3).
 */

import { runAudit } from '../main.js';


/**
 * Listens for messages from the popup or other components.
 * specific action: 'START_AUDIT'
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_AUDIT') {
    const { domain, tabId } = request.payload;

    if (!domain || !tabId) {
      console.warn('Audit skipped: Missing domain or tabId.');
      return;
    }

    // Run the audit asynchronously
    runAudit(domain, tabId)
      .then(auditResults => {
        // Broadcast results back to the popup
        chrome.runtime.sendMessage({
          type: 'AUDIT_COMPLETED',
          payload: {
            domain,
            results: auditResults,
            timestamp: Date.now()
          }
        }).catch(err => {
          console.log('Results sent, but no active popup listener found.', err);
        });
      })
      .catch(error => {
        console.error('Extension Background Error:', error);
        chrome.runtime.sendMessage({
          type: 'AUDIT_ERROR',
          error: error.message
        }).catch(() => { /* Ignore failure */ });
      });

    // Return true to indicate we will respond asynchronously (though we are using sendMessage here)
    return true;
  }
});