/**
 * popup.js
 * Listen for and display audit results from the background script.
 */

/**
 * Updates the popup DOM with provided audit data.
 * @param {Object} data - The audit result object.
 */
const updateUI = (data) => {
  // 1. Update Domain
  document.getElementById('domain').textContent = data.domain || 'Unknown';

  // 2. Update Policy Change Status (Boolean to Text)
  const statusEl = document.getElementById('changeStatus');
  statusEl.textContent = data.changesDetected ? 'Changed' : 'No Changes';
  statusEl.className = data.changesDetected ? 'status-changed' : 'status-stable';

  // 3. Update Risk List (Array to <ul>)
  const riskListEl = document.getElementById('riskList');
  riskListEl.innerHTML = ''; // Clear existing items
  if (Array.isArray(data.risks) && data.risks.length > 0) {
    data.risks.forEach(risk => {
      const li = document.createElement('li');
      li.textContent = risk;
      riskListEl.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No risks identified';
    riskListEl.appendChild(li);
  }

  // 4. Update Severity
  const severityEl = document.getElementById('severity');
  severityEl.textContent = data.severity || 'N/A';
  // Add CSS class based on severity value (e.g., 'high', 'medium', 'low')
  if (data.severity) {
    severityEl.classList.add(`severity-${data.severity.toLowerCase()}`);
  }

  // 5. Update Summary
  document.getElementById('summary').textContent = data.summary || 'No summary available.';
};

/**
 * Listen for the 'AUDIT_COMPLETED' message from background.js
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AUDIT_COMPLETED' && message.payload) {
    updateUI(message.payload);
  }
  
  // Return true to keep the message channel open for async responses if needed
  return true;
});