import React from "react";

/**
* Displays tabs for switching between multiple PDF files
* 
* @param {Array} files - Array of File objects
* @param {Number} activeIndex - Index of currently active file
* @param {Function} onFileChange - Callback when file tab is clicked
* @param {Number} templateFileIdx - Index of the template file (if any)
*/

export default function FileTabBar({ files, activeIndex, onFileChange, templateFileIdx = null }) {
    if (!files || files.length === 0) return null;

    // Filter to only PDF files
    const pdfFiles = files
        .map((f, i) => ({ file: f, index: i }))
        .filter(({ file }) => file.name.toLowerCase().endsWith(".pdf"));

    if (pdfFiles.length === 0) return null;

    return (
        <div className="file-tab-bar">
            {pdfFiles.map(({ file, index }) => {
                const isActive = index === activeIndex;
                const isTemplate = index === templateFileIdx;
                
                return (
                    <button
                        key={`${file.name}-${index}`}
                        type="button"
                        onClick={() => onFileChange(index)}
                        className={`file-tab ${isActive ? "active" : ""}`}
                        title={file.name}
                    >
                        <span className="file-tab-name">{file.name}</span>
                        {isTemplate && <span className="template-badge">• template</span>}
                    </button>
                );
            })}
        </div>
    );
}