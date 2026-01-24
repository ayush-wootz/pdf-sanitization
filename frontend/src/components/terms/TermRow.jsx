import React from "react";
import { IconX } from "../../assets/icons";

/**
 * TermRow Component
 * Individual term row with term and replacement inputs
 * 
 * @param {Number} index - Term index in list
 * @param {String} term - Term text
 * @param {String} replacement - Replacement text
 * @param {Function} onTermChange - Callback when term changes
 * @param {Function} onReplacementChange - Callback when replacement changes
 * @param {Function} onRemove - Callback when remove is clicked
 */

export default function TermRow({
    index,
    term = "",
    replacement = "",
    onTermChange,
    onReplacementChange,
    onRemove,
}) {
    return (
        <div className="term-row">
            <div className="term-inputs">
                {/* Term Input */}
                <div className="term-input-group">
                    <label className="term-input-label">Term</label>
                    <input 
                        type="text"
                        value={term}
                        onChange={(e) => onTermChange(e.target.value)}
                        placeholder="Sensitive term"
                        className="term-input"
                    />
                </div>

                {/* Replacement Input */}
                <div className="term-input-group">
                    <label className="term-input-label">Replace with</label>
                    <input 
                        type="text"
                        value={replacement}
                        onChange={(e) => onReplacementChange(e.target.value)}
                        placeholder="Leave blank to redact"
                        className="term-input"
                    />
                </div>
            </div>

            {/* Remove Button */}
            <button
                type="button"
                onClick={onRemove}
                className="term-remove-btn"
                title="Remove term"
            >
                <IconX className="h-3 w-3" />
            </button>
        </div>
    );
}