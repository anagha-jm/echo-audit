/**
 * content.js
 * Responsible for extracting visible text content from the DOM
 * and communicating with the background script.
 */

/**
 * Extracts clean, visible text from the document body.
 * Removes non-visible elements like scripts, styles, and hidden tags.
 */
function getCleanPageText() {
  try {
    // Clone the body to avoid mutating the live DOM during extraction
    const bodyClone = document.body.cloneNode(true);

    // List of selectors to strip out (non-content elements)
    const noiseSelectors = [
      'script', 
      'style', 
      'noscript', 
      'iframe', 
      'svg', 
      'canvas', 
      'header', 
      'footer', 
      'nav'
    ];

    // Remove all noise elements from the clone
    noiseSelectors.forEach(selector => {
      const elements = bodyClone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    /**
     * innerText is preferred over textContent here as it:
     * 1. Respects CSS styling (doesn't capture hidden text).
     * 2. Normalizes spacing/line breaks more naturally for analysis.
     */
    const rawText = bodyClone.innerText || bodyClone.textContent || "";

    // Clean up excessive whitespace and newlines for a smaller payload
    return rawText
      .replace(/\s\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim();

  } catch (error) {
    console.error('Content Script Extraction Error:', error);
    return "";
  }
}

/**
 * Listener for messages from the background script.
 * Responds with the extracted text content.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXTRACT_PAGE_TEXT") {
    const pageText = getCleanPageText();
    
    // Send response back to background.js
    sendResponse({ 
      text: pageText, 
      length: pageText.length 
    });
  }
  
  // Return true to indicate asynchronous response if needed
  return true;
});