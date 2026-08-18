/**
 * Utility functions for medicine listings.
 * 
 * Demonstrates: JavaScript Hoisting.
 * In JavaScript, function declarations are hoisted to the top of their enclosing scope,
 * meaning they can be referenced and executed before their physical definitions in the source code.
 */

/**
 * Returns a human-readable, formatted version of the medicine status.
 * Demonstrates hoisting by calling `formatStatus` before its actual definition block.
 */
export function getMedicineStatusLabel(status: string): string {
  // formatStatus is called here, but declared further down the file.
  // JavaScript's interpreter loads function declarations into memory during the creation phase,
  // making it perfectly valid to execute here.
  return formatStatus(status);
}

/**
 * Checks whether a medicine's expiry date has passed.
 * Demonstrates hoisting by calling `parseExpiryToDate` before its declaration.
 */
export function isMedicineExpired(expiryDateStr: string): boolean {
  const expiryDate = parseExpiryToDate(expiryDateStr);
  if (!expiryDate) return false;
  return expiryDate.getTime() < Date.now();
}

/**
 * Helper to capitalize and clean up the status string.
 * This function declaration is hoisted during compilation.
 */
function formatStatus(status: string): string {
  if (!status) return "";
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letters
}

/**
 * Parses expiry strings of formats "MM/YYYY" or standard date strings into Dates.
 * This function declaration is hoisted during compilation.
 */
function parseExpiryToDate(dateStr: string): Date | null {
  if (!dateStr || dateStr.toLowerCase() === "n/a" || dateStr.includes("ago")) {
    return null;
  }
  
  // Format check for "MM/YYYY" (e.g. "12/2028")
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 2) {
      const month = parseInt(parts[0], 10) - 1;
      const year = parseInt(parts[1], 10);
      if (!isNaN(month) && !isNaN(year)) {
        return new Date(year, month, 1);
      }
    }
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}
