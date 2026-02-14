/**
 * logic/comparator.js
 * Responsibilities:
 * - Performs a direct string comparison between baseline and current ToS.
 * - Returns a structured object indicating if differences exist.
 */

export function compareTexts(oldText, newText) {
  // Check for null or undefined inputs
  if (oldText === null || newText === null) {
    return {
      changesDetected: false,
      changedSections: ""
    };
  }

  // Perform string comparison
  const isIdentical = oldText === newText;

  if (isIdentical) {
    return {
      changesDetected: false,
      changedSections: ""
    };
  } else {
    return {
      changesDetected: true,
      changedSections: newText
    };
  }
}