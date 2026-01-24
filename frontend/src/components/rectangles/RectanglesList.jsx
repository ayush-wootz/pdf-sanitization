import React from "react";
import RectangleItem from "./RectangleItem";
import "../../styles/rectangles.css";

/**
 * RectanglesList Component
 * Container for displaying and managing all rectangles
 * 
 * @param {Array} rects - Array of rectangle objects
 * @param {Object} rectActions - Rectangle actions map (id -> {action, logoFile, logoKey})
 * @param {Function} onRemove - Callback when rectangle is removed
 * @param {Function} onActionChange - Callback when action changes (id, action)
 * @param {Function} onLogoUpload - Callback when logo is uploaded (id, file, key)
 * @param {String} apiBase - API base URL for logo upload
 */

export default function RectanglesList({
    rects,
    rectActions,
    onRemove,
    onActionChange,
    onLogoUpload,
    apiBase = "",
}) {
    if (!rects || rects.length === 0) {
        return (
            <div className="rectangle-empty">
                <p className="text-sm text-neutral-400">No rectangles added yet</p>
                <p className="text-xs text-neutral-500 mt-2">
                    Draw rectangles on the PDF to mark areas for redaction or logo placement.
                </p>
            </div>
        );
    }

    return (
        <div className="rectangle-list">
            <div className="rectangles-header">
                <h3 className="text-sm font-semibold text-neutral-200">
                    Rectangles ({rects.length})
                </h3>
            </div>

            <ul className="rectangles-items">
                {rects.map((rect, idx) => (
                    <RectangleItem
                        key={rect.id}
                        rect={rect}
                        index={idx}
                        action={rectActions[rect.id]}
                        onRemove={() => onRemove(rect.id)}
                        onActionChange={(action) => onActionChange(rect.id, action)}
                        onLogoUpload={(file, key) => onLogoUpload(rect.id, file, key)}
                        apiBase={apiBase}
                    />
                ))}
            </ul>
        </div>
    )
}