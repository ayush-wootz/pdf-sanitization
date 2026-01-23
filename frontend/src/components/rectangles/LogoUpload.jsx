import React, { use, useState } from "react";

/**
* LogoUpload Component
* File input for uploading logo images
* Automatically uploads to backend and returns storage key
* 
* @param {File} logoFile - Currently selected logo file
* @param {String} logoKey - Storage key from backend (e.g., "logos/logo.png")
* @param {Function} onLogoUpload - Callback when logo is uploaded (file, key)
* @param {String} apiBase - API base URL
*/

export default function LogoUpload({ logoFile, logoKey, onLogoUpload, apiBase = "" }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];

        // Clear selection
        if (!file) {
            onLogoUpload(null, undefined);
            setError("");
            return;
        }

        // Validate file size (100KB max)
        const maxKB = 100;
        if (file.size > maxKB * 1024) {
            setError(`Logo too large. Max size is ${maxKB}KB.`);
            e.target.value = ""; // Clear input
            return;
        }

        setError("");
        setUploading(true);

        try {
            // Upload to backend
            const formData = new FormData();
            formData.append("logo", file);

            const url = apiBase ? `${apiBase}/upload-logo` : "/api/upload-logo";
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed (${response.status})`);
            }

            const data = await response.json();
            const key = data.key;

            if (!key) {
                throw new Error("No storage key returned from server");
            }

            // Notify parent with file and key
            onLogoUpload(file, key);
        } catch (err) {
            console.error("Logo upload error:", err);
            setError(`Upload failed: ${err.message}`);
            e.target.value = ""; // Clear input
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="logo-upload">
            <label className="logo-label">
                Upload logo
                <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .webp, .svg"
                    className="logo-input"
                    onChange={handleFileChange}
                    disabled={uploading}
                />
            </label>

            {/* Upload status */}
            {uploading && (
                <div className="logo-status uploading">
                    <span className="status-text">Uploading...</span>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="logo-status error">
                    <span className="status-text">{error}</span>
                </div>
            )}

            {/* Success status */}
            {logoFile && logoKey && !uploading && !error && (
                <div className="logo-status success">
                    <span className="status-text">{logoFile.name}</span>
                    {logoKey && <span className="status-key">({logoKey})</span>}
                </div>
            )}
        </div>
    );
}