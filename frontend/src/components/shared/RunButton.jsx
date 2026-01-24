import React from "react";
import { IconCheck } from "../../assets/icons";
import "../../styles/shared.css";

/**
 * RunButton Component
 * Reusable button for running sanitization with loading state
 * 
 * @param {Function} onClick - Callback when button is clicked
 * @param {Boolean} disabled - Whether button is disabled
 * @param {Boolean} isProcessing - Whether processing is active (shows spinner)
 * @param {String} label - Button label text
 * @param {String} processingLabel - Label shown while processing
 */
export default function RunButton({
  onClick,
  disabled = false,
  isProcessing = false,
  label = "Run Sanitization",
  processingLabel = "Processing...",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isProcessing}
      className={`run-button ${disabled || isProcessing ? "disabled" : ""}`}
    >
      {isProcessing ? (
        <>
          <div className="run-button-spinner"></div>
          {processingLabel}
        </>
      ) : (
        <>
          <IconCheck className="run-button-icon" />
          {label}
        </>
      )}
    </button>
  );
}