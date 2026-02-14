/**
 * logic/loader.js
 * * Responsibilities:
 * - Reads tos_map.json to find the filename for a given domain.
 * - Fetches the text content of the baseline file from the extension's local directory.
 */

export async function loadBaseline(domain) {
  try {
    // 1. Fetch the mapping file
    const mapResponse = await fetch(chrome.runtime.getURL('baseline_tos/tos_map.json'));
    if (!mapResponse.ok) throw new Error('Failed to load ToS map.');
    
    const tosMap = await mapResponse.json();

    // 2. Check if domain exists in the map
    const fileName = tosMap[domain];
    if (!fileName) {
      console.warn(`Domain ${domain} is not supported by Echo-Audit.`);
      return null;
    }

    // 3. Fetch the content of the specific baseline .txt file
    const fileResponse = await fetch(chrome.runtime.getURL(`baseline_tos/${fileName}`));
    if (!fileResponse.ok) throw new Error(`Failed to load baseline file: ${fileName}`);

    const textContent = await fileResponse.text();
    return textContent;

  } catch (error) {
    console.error('Echo-Audit Loader Error:', error);
    return null;
  }
}
