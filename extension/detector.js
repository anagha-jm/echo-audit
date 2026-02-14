/**
 * detector.js
 * * Module for extracting and normalizing domain names from browser tabs.
 */

/**
 * Extracts a clean domain name from a tab object.
 * * @param {chrome.tabs.Tab} tab - The tab object provided by the Chrome API.
 * @returns {string|null} The cleaned domain (e.g., "example.com") or null if invalid.
 */
export function getDomainFromTab(tab) {
  // Return null if the tab or URL property is missing
  if (!tab || !tab.url) {
    return null;
  }

  try {
    // Use the URL constructor to parse the string
    const url = new URL(tab.url);

    // Filter out non-web protocols (chrome://, file://, etc.)
    if (!url.protocol.startsWith('http')) {
      return null;
    }

    // Extract hostname (e.g., "www.sub.example.com")
    let hostname = url.hostname;

    // Remove the "www." prefix if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    return hostname;
  } catch (error) {
    // Handle malformed URLs gracefully
    return null;
  }
}