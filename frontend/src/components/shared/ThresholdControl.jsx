import React from "react";
import "../../styles/shared.css";

/**
 * ThresholdControl Component
 * Reusable threshold number input for sanitization confidence level
 * 
 * @param {Number} value - Current threshold value (0-1)
 * @param {Function} onChange - Callback when threshold changes
 * @param {Boolean} disabled - Whether input is disabled
 */
export default function ThresholdControl({ value = 0.9, onChange, disabled = false }) {
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value) || 0;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="threshold-control">
      <label className="threshold-label">
        Confidence Threshold:
        <input
          type="number"
          step="0.01"
          min="0"
          max="1"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="threshold-input"
        />
      </label>
      <p className="threshold-hint">
        Higher values = stricter matching (0.0 - 1.0)
      </p>
    </div>
  );
}