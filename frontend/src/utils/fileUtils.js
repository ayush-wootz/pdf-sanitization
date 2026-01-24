/**
 * File Utilities
 * Helper functions for file validation and processing
 */

/**
 * Check if a file is a PDF
 * @param {File} file - File object to check
 * @returns {Boolean} - True if file is a PDF
 */
export function isPdf(file) {
  if (!file || typeof file.name !== "string") return false;
  const ext = file.name.toLowerCase().endsWith(".pdf");
  const mime = file.type === "application/pdf" || file.type === "";
  return ext || mime;
}

/**
 * Validate file size
 * @param {File} file - File object to validate
 * @param {Number} maxMB - Maximum file size in megabytes
 * @returns {Boolean} - True if file is within size limit
 */
export function validateFileSize(file, maxMB = 10) {
  if (!file) return false;
  const maxBytes = maxMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Format file size for display
 * @param {Number} bytes - File size in bytes
 * @returns {String} - Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 KB";
  
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(0)} KB`;
  }
  
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Filter only valid PDF files from a list
 * @param {Array<File>} files - Array of File objects
 * @returns {Array<File>} - Array of valid PDF files
 */
export function filterPdfFiles(files) {
  return (files || []).filter((file) => {
    const valid = isPdf(file);
    if (!valid) {
      console.warn(`"${file.name}" is not a valid PDF and was skipped.`);
    }
    return valid;
  });
}

/**
 * Remove duplicate files based on name and size
 * @param {Array<File>} existingFiles - Current file list
 * @param {Array<File>} newFiles - New files to add
 * @returns {Array<File>} - Merged array without duplicates
 */
export function mergeDedupedFiles(existingFiles, newFiles) {
  const key = (f) => `${f.name}::${f.size}`;
  const existing = new Set(existingFiles.map(key));
  const merged = [...existingFiles];
  
  for (const file of newFiles) {
    if (!existing.has(key(file))) {
      merged.push(file);
    }
  }
  
  return merged;
}

/**
 * Validate logo file (size and format)
 * @param {File} file - Logo file to validate
 * @param {Number} maxKB - Maximum size in kilobytes (default 100KB)
 * @returns {Object} - { valid: Boolean, error: String }
 */
export function validateLogoFile(file, maxKB = 100) {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  // Check file size
  const sizeKB = file.size / 1024;
  if (sizeKB > maxKB) {
    return {
      valid: false,
      error: `Logo file is too large (${sizeKB.toFixed(0)} KB). Maximum size is ${maxKB} KB.`
    };
  }

  // Check file format
  const validFormats = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
  if (!validFormats.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid logo format. Please upload PNG, JPG, SVG, or WEBP."
    };
  }

  return { valid: true, error: null };
}