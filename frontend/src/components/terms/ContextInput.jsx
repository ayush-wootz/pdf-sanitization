import React from "react";

/**
 * ContextInput Component
 * Textarea for providing optional context to LLM term generation
 * 
 * @param {String} value - Current context value
 * @param {Function} onChange - Callback when context changes
 */
export default function ContextInput({ value, onChange }) {
  return (
    <div className="context-input">
      <label className="context-label">
        Custom context (optional)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        placeholder="Provide additional context for the LLM to better identify sensitive terms..."
        className="context-textarea"
      />
      <p className="context-hint">
        Add specific details about the document type, industry, or sensitive information patterns to improve term detection.
      </p>
    </div>
  );
}