/**
 * logic/fetcher.js
 * Responsibilities:
 * - Fetches live HTML from a URL.
 * - Extracts and cleans visible text content.
 */

export async function fetchCurrent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();

    // Parse HTML string into a document object
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove non-visible/non-content elements to clean the extraction
    const scriptsAndStyles = doc.querySelectorAll('script, style, nav, footer, noscript, iframe');
    scriptsAndStyles.forEach(el => el.remove());

    // Extract text and clean whitespace
    const textContent = doc.body.innerText || doc.body.textContent || "";
    
    // Replace multiple spaces/newlines with a single space and trim
    const cleanedText = textContent
      .replace(/\s+/g, ' ')
      .trim();

    return cleanedText || null;

  } catch (error) {
    console.error('Echo-Audit Fetcher Error:', error);
    return null;
  }
}