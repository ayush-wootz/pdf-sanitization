import React from "react";
import "../../styles/shared.css";

/**
 * ResultsSection Component
 * Displays sanitization results with download and secondary processing options
 * 
 * @param {String} zipUrl - URL to download sanitized ZIP file
 * @param {Array} lowConfidence - Array of low confidence results
 * @param {String} clientName - Client name for ZIP download
 * @param {Function} onDownload - Callback when download is clicked
 * @param {Function} onSecondaryProcess - Callback when secondary process is clicked
 * @param {Boolean} showSecondaryButton - Whether to show secondary process button
 */
export default function ResultsSection({
  zipUrl,
  lowConfidence = [],
  clientName = "client",
  onDownload,
  onSecondaryProcess,
  showSecondaryButton = true,
}) {
  const hasLowConfidence = Array.isArray(lowConfidence) && lowConfidence.length > 0;
  const hasResults = zipUrl || hasLowConfidence;

  if (!hasResults) {
    return (
      <div className="results-empty">
        <p className="text-xs text-neutral-400">No results to display yet.</p>
        <p className="text-xs text-neutral-500 mt-1">
          Run sanitization to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="results-section">
      {/* Action Buttons */}
      <div className="results-actions">
        {/* Download ZIP Button */}
        {zipUrl && (
          <button
            type="button"
            className="results-button download"
            onClick={onDownload}
          >
            <svg className="results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download ZIP
          </button>
        )}

        {/* Secondary Process Button */}
        {hasLowConfidence && showSecondaryButton && (
          <button
            type="button"
            className="results-button secondary"
            onClick={onSecondaryProcess}
          >
            <svg className="results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Proceed with secondary process batch
          </button>
        )}
      </div>

      {/* Low Confidence Summary */}
      {hasLowConfidence && (
        <div className="results-summary">
          <h4 className="summary-title">Low-confidence summary</h4>
          <ul className="summary-list">
            {lowConfidence.map((item, idx) => {
              const fileName = (item.pdf || "").split(/[\\/]/).pop() || item.pdf;
              const pageNumbers = Object.keys(item.low_rects || {})
                .map((n) => Number(n) + 1)
                .sort((a, b) => a - b);

              return (
                <li key={idx} className="summary-item">
                  <span className="summary-file">{fileName}</span>
                  {pageNumbers.length > 0 && (
                    <span className="summary-pages">
                      {" "}— pages: {pageNumbers.join(", ")}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}