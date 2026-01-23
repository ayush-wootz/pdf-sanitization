import React from "react";
import TermRow from "./TermRow";

/**
 * TermsTable Component
 * Container for displaying all term rows
 * 
 * @param {Array} terms - Array of term objects [{term, replacement}, ...]
 * @param {Function} onTermChange - Callback when term text changes (index, term)
 * @param {Function} onReplacementChange - Callback when replacement changes (index, replacement)
 * @param {Function} onRemoveTerm - Callback when term is removed (index)
 */
export default function TermsTable({
  terms = [],
  onTermChange,
  onReplacementChange,
  onRemoveTerm,
}) {
  if (terms.length === 0) {
    return (
      <div className="terms-empty">
        <p className="text-xs text-neutral-400">
          No terms yet. Add terms manually or generate via LLM.
        </p>
      </div>
    );
  }

  return (
    <div className="terms-table">
      {terms.map((item, index) => (
        <TermRow
          key={index}
          index={index}
          term={item.term}
          replacement={item.replacement}
          onTermChange={(term) => onTermChange(index, term)}
          onReplacementChange={(replacement) => onReplacementChange(index, replacement)}
          onRemove={() => onRemoveTerm(index)}
        />
      ))}
    </div>
  );
}