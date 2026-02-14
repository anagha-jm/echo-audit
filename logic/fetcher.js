/**
 * logic/fetcher.js
 * Responsibilities:
 * - Sends a message to the content script to extract visible text.
 */

export async function fetchCurrent(tabId) {
  try {
    if (!tabId) {
      throw new Error("No tabId provided for fetching.");
    }

    // Send message to the content script
    const response = await chrome.tabs.sendMessage(tabId, { action: "EXTRACT_PAGE_TEXT" });

    if (!response || !response.text) {
      // This might happen if the content script hasn't loaded yet or on restricted pages
      return null;
    }

    return response.text;

  } catch (error) {
    console.error('Echo-Audit Fetcher Error:', error);
    return null;
  }
}