import React from "react";
import { IconPlus } from "../assets/icons";
import ContextInput from "./ContextInput";
import TermsTable from "./TermsTable";
import "../styles/terms.css";

/**
 * LLMTermsSection Component
 * Complete LLM terms generation and management section
 * 
 * @param {Array} terms - Array of term objects [{term, replacement}, ...]
 * @param {String} context - Optional context for LLM generation
 * @param {Boolean} isGenerating - Whether LLM is currently generating
 * @param {Boolean} hasFiles - Whether files are uploaded (to enable generate button)
 * @param {Function} onContextChange - Callback when context changes
 * @param {Function} onGenerate - Callback to trigger LLM generation
 * @param {Function} onTermChange - Callback when term text changes (index, term)
 * @param {Function} onReplacementChange - Callback when replacement changes (index, replacement)
 * @param {Function} onRemoveTerm - Callback when term is removed (index)
 * @param {Function} onAddTerm - Callback to add new term
 */
export default function LLMTermsSection({
  terms = [],
  context = "",
  isGenerating = false,
  hasFiles = true,
  onContextChange,
  onGenerate,
  onTermChange,
  onReplacementChange,
  onRemoveTerm,
  onAddTerm,
}) {
  return (
    <div className="llm-terms-section">
      {/* Header with Generate Button */}
      <div className="llm-header">
        <h2 className="llm-title">Generate sensitive terms using LLM</h2>
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating || !hasFiles}
          className="llm-generate-btn"
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              Generating...
            </>
          ) : (
            <>
              <IconPlus className="h-3 w-3" />
              Generate Terms
            </>
          )}
        </button>
      </div>

      {/* Context Input */}
      <ContextInput value={context} onChange={onContextChange} />

      {/* Terms Table */}
      <div className="llm-content">
        <div className="terms-header">
          <h3 className="terms-count">Terms ({terms.length})</h3>
        </div>

        <TermsTable
          terms={terms}
          onTermChange={onTermChange}
          onReplacementChange={onReplacementChange}
          onRemoveTerm={onRemoveTerm}
        />

        {/* Add Term Button */}
        <div className="terms-footer">
          <button
            type="button"
            onClick={onAddTerm}
            className="add-term-btn"
          >
            <IconPlus className="h-3 w-3" />
            Add Term
          </button>
        </div>
      </div>
    </div>
  );
}