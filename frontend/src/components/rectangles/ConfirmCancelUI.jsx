import React from "react";
import { IconCheck, IconX } from "../../assets/icons";

/**
 * ConfirmCancelUI Component
 * Floating UI that appears after drawing a rectangle
 * Allows user to confirm or cancel the drawn rectangle
 * 
 * @param {Object} position - Position {left, top} in pixels
 * @param {Function} onConfirm - Callback when Confirm is clicked
 * @param {Function} onCancel - Callback when Cancel is clicked
 */

export default function ConfirmCancelUI({ position, onConfirm, onCancel }) {
    if (!position) return null;

    return (
        <div
            className="confirm-cancel-ui"
            style={{
                position: "absolute",
                left: position.left,
                top: position.top,
                zIndex: 20,
            }}
        >
            <div className="confirm-cancel-buttons">
                <button
                    type="button"
                    className="btn btn-confirm"
                    onClick={onConfirm}
                    title="Confirm rectangle"
                >
                    <IconCheck /> Confirm
                </button>
                <button
                    type="button"
                    className="btn btn-cancel"
                    onClick={onCancel}
                    title="Cancel rectangle"
                >
                    <IconX /> Cancel
                </button>
            </div>
        </div>
    );
}