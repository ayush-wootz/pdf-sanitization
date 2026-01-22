import React, { useRef } from "react";
import { IconUploadCloud, IconCheck } from "../assets/icons";
import FileList from "../common/FileList";
import "../styles/landing.css";

/**
 * LandingPage Component
 * Entry point for the application - handles file upload and template selection
 * 
 * Props:
 * @param {Array} files - Currently selected PDF files
 * @param {Function} onFileAdd - Callback to add new files
 * @param {Function} onFileRemove - Callback to remove a file by index
 * @param {Array} existingTemplates - List of existing template names
 * @param {String} selectedTemplate - Currently selected template ("" | "new" | template name)
 * @param {Function} onTemplateChange - Callback when template dropdown changes
 * @param {String} newTemplateName - Name for new template (if creating)
 * @param {Function} onNewTemplateNameChange - Callback when new template name changes
 * @param {Function} onContinue - Callback when Continue button is clicked
 * @param {Boolean} isLoading - Whether templates are loading
 */

export default function LandingPage({
    files,
    onFileAdd,
    onFileRemove,
    existingTemplates,
    selectedTemplate,
    onTemplateChange,
    newTemplateName,
    onNewTemplateNameChange,
    onContinue,
    isLoading = false
}) {
    const fileInputRef = useRef(null);

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        onFileAdd(selectedFiles);
        // Reset input so same file can be selected again
        e.currentTarget.value = null;
    };

    // Trigger file input click
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const isTemplateValid = selectedTemplate === "new"
        ? newTemplateName.trim().length > 0
        : selectedTemplate.trim().length > 0;
    
    const canSubmit = files.length > 0 && isTemplateValid && !isLoading;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (canSubmit) {
            onContinue();
        }
    };

    return (
        <main className="home">
            <div className="container">
                {/* Header */}
                <header className="brand">
                    <h1 className="title">Wootz.Sanitize</h1>
                    <p className="subtitle">
                        Upload PDF drawings and select an existing template or create a new one
                    </p>
                </header>

                {/* Main Form */}
                <section className="card section">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div>
                                {/* File Upload Section */}
                                <label className="label">
                                    Files <span style={{ color: "var(--danger)" }}>*</span>
                                </label>
                                <div style={{display: "flex", alignItems: "center", gap: 12}}>
                                    <button 
                                        type="button"
                                        onClick={handleUploadClick}
                                        className="btn"
                                        disabled={isLoading}
                                    >
                                        <IconUploadCloud /> Upload Files
                                    </button>
                                    <span className="muted">
                                        {files.length > 0 ? `${files.length} selected` : "PDFs only"}
                                    </span>
                                </div>

                                {/* Hidden File Input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="application/pdf,.pdf"
                                    onChange={handleFileChange}
                                />

                                {/* File List */}
                                <FileList files={files} onRemove={onFileRemove} />

                                {/* Template Selection */}
                                <div className="template" style={{marginTop: 18}}>
                                    <label className="label">Template</label>
                                    <select
                                        className="select"
                                        value={selectedTemplate}
                                        onChange = {(e) => onTemplateChange(e.target.value)}
                                        disabled={isLoading}
                                    >
                                        <option value="" disabled>
                                            {isLoading ? "Loading templates..." : "Select a template"}
                                        </option>
                                        <option value="new">Create new template</option>
                                        {existingTemplates.map((template) => (
                                            <option key={template} value={template}>
                                                {template}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* New Template Name Input (Conditional) */}
                                {selectedTemplate === "new" && (
                                    <div style={{ marginTop: 14 }}>
                                        <label className="label">New template name</label>
                                        <input
                                            type="text"
                                            value={newTemplateName}
                                            onChange={(e) => onNewTemplateNameChange(e.target.value)}
                                            placeholder="Name this template"
                                            className="select"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer with submit button */}
                        <div className="footer">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={!canSubmit}
                                title={
                                    !canSubmit
                                        ? "Select PDF(s) and choose or name a template"
                                        : "Continue"
                                }
                            >
                                <IconCheck /> Continue
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}