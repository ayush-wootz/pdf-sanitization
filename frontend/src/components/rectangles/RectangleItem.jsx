import React from "react";
import { IconTrash2 } from "../assets/icons";
import RectangleActions from "./RectangleActions";
import LogoUpload from "./LogoUpload";

/**
* RectangleItem Component
* Individual rectangle card with action selector and logo upload
* 
* @param {Object} rect - Rectangle object {id, x, y, w, h, fileIdx, page, paper, orientation}
* @param {Number} index - Rectangle index in list
* @param {Object} action - Action object {action: 'redact'|'logo', logoFile, logoKey}
* @param {Function} onRemove - Callback when remove is clicked
* @param {Function} onActionChange - Callback when action changes
* @param {Function} onLogoUpload - Callback when logo is uploaded (file, key)
* @param {String} apiBase - API base URL for logo upload
*/

export default function RectangleItem({
    rect,
    index,
    action = { action: "redact" },
    onRemove,
    onActionChange,
    onLogoUpload,
    apiBase = "",
}) {
    return (
        <li className="rectangle-item">
            {/* Header */}
            <div className="rectangle-header">
                <div className="rectangle-title">
                    <span className="rectangle-number">#{index + 1}</span>
                    <span className="rectangle-label">Rectangle</span>
                </div>
                <button 
                    type="button"
                    className="rectangle-remove-btn"
                    onClick={onRemove}
                    title="Remove rectangle"
                >
                    <IconTrash2 /> Remove
                </button>
            </div>

            {/* Coordinates */}
            <div className="rectangle-coords">
                <span className="coord">x: {rect.x}</span>
                <span className="coord">y: {rect.y}</span>
                <span className="coord">w: {rect.w}</span>
                <span className="coord">h: {rect.h}</span>
            </div>

            {/* Metadata */}
            {(rect.page !== undefined || rect.paper || rect.orientation) && (
                <div className="rectangle-meta">
                    {rect.page !== undefined && (
                        <span className="meta-item">Page {rect.paper}</span>
                    )}
                    {rect.paper && <span className="meta-item">{rect.paper}</span>}
                    {rect.orientation && (
                        <span className="meta-item">
                            {rect.orientation === "H" ? "Horizontal" : "Vertical"}
                        </span>
                    )}
                </div>
            )}

            {/* Action Selector */}
            <RectangleActions
                action={action.action || "redact"}
                onActionChange={onActionChange}
            />

            {/* Logo Upload (when action is 'logo') */}
            {action.action === "logo" && (
                <LogoUpload
                    logoFile={action.logoFile}
                    logoKey={action.logoKey}
                    onLogoUpload={onLogoUpload}
                    apiBase={apiBase}
                /> 
            )}
        </li>
    );
}