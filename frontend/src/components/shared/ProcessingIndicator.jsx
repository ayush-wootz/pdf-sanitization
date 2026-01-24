import React from "react";
import "../../styles/shared.css";

/**
 * ProcessingIndicator Component
 * Shows processing status with spinner and progress bar
 * 
 * @param {Boolean} isProcessing - Whether processing is active
 * @param {Number} progress - Progress percentage (0-100)
 * @param {String} message - Custom processing message
 */
export default function ProcessingIndicator({
  isProcessing = false,
  progress = 0,
  message = "Processing PDFs...",
}) {
  if (!isProcessing) return null;

  return (
    <div className="processing-indicator">
      {/* Progress Info */}
      <div className="processing-header">
        <span className="processing-message">{message}</span>
        <span className="processing-percentage">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="processing-bar-container">
        <div
          className="processing-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}