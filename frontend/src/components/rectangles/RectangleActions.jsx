import React from "react";

/**
* RectangleActions Component
* Dropdown selector for rectangle action (redact or logo)
* 
* @param {String} action - Current action ('redact' or 'logo')
* @param {Function} onActionChange - Callback when action changes
*/

export default function RectangleActions({ action = "redact", onActionChange }) {
    return (
        <div className="rectangle-actions">
            <label className="action-label">
                Action
                <select
                    className="action-select"
                    value={action}
                    onChange={(e) => onActionChange(e.target.value)}
                >
                    <option value="redact">Redact (no replacement)</option>
                    <option value="logo">Insert logo here</option>
                </select>
            </label>
        </div>
    );
}