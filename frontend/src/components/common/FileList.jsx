import React from 'react';
import { IconX } from '../../assets/icons';

/**
 * FileList Component
 * Displays a list of uploaded PDF files with remove buttons
 *
 * @param {Array} files - Array of File objects
 * @param {Function} onRemove - Callback when remove button is clicked (index)
*/

export default function FileList({ files, onRemove }) {
    if (!files || files.length === 0) {
        return null;
    }

    return (
        <div className="filelist">
            <h3>Selected files</h3>
            <ul className="files">
                {files.map((file, index) => (
                    <li key={`${file.name}-${index}`} className="file">
                        <div style={{display: "flex", alignItems: "center", minWidth: 0}}>
                            <span className="name">{file.name}</span>
                            <span className="meta">{(file.size / 1024).toFixed(0)} KB</span>
                        </div>
                        <button
                            type="button"
                            className="btn remove"
                            title="Remove"
                            onClick={() => onRemove(index)}
                        >
                            <IconX /> Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}