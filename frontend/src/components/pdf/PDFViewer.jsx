import React, { useEffect } from "react";
import { usePDFRenderer } from "../../hooks/usePDFRenderer";
import { useRectangleDrawing } from "../../hooks/useRectangleDrawing";
import PageNavigation from "./PageNavigation";
import FileTabBar from "./FileTabBar";
import DrawingOverlay from "./DrawingOverlay";
import "../../styles/pdf.css";

/**
 * PDFViewer Component
 * Main PDF viewing component with drawing capabilities
 * Canvas is ALWAYS mounted to prevent "canvas disappeared" errors
 */
export default function PDFViewer({
  files,
  activeFileIndex = 0,
  onFileChange,
  pageIndex = 0,
  onPageChange,
  existingRects = [],
  onRectsChange,
  drawingEnabled = true,
  templateFileIdx = null,
  lowConfidencePages = [],
}) {
  const currentFile = files[activeFileIndex];

  // Use PDF renderer hook
  const { canvasRef, wrapperRef, pageCount, pageMeta, renderError, isLoading } = usePDFRenderer(
    currentFile,
    pageIndex,
    1
  );

  // Use rectangle drawing hook
  const { rects, draft, confirmUI, handlers, actions } = useRectangleDrawing(
    pageMeta,
    activeFileIndex
  );

  // Sync rects with parent when they change
  useEffect(() => {
    if (onRectsChange) {
      onRectsChange(rects);
    }
  }, [rects, onRectsChange]);

  // Load existing rects on mount
  useEffect(() => {
    if (existingRects && existingRects.length > 0) {
      actions.setRects(existingRects);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageJump = (targetPage) => {
    if (onPageChange) {
      onPageChange(targetPage);
    }
  };

  return (
    <div className="pdf-viewer">
      {/* Header */}
      <div className="pdf-viewer-header">
        <div className="pdf-viewer-title">
          {currentFile ? (
            <>
              Preview: <span className="font-medium">{currentFile.name}</span>
            </>
          ) : (
            "No file selected"
          )}
        </div>
        {drawingEnabled && (
          <div className="pdf-viewer-hint">
            👁 Showing PDFs to draw rectangles
          </div>
        )}
      </div>

      {/* File Tabs */}
      {files.length > 1 && (
        <FileTabBar
          files={files}
          activeIndex={activeFileIndex}
          onFileChange={onFileChange}
          templateFileIdx={templateFileIdx}
        />
      )}

      {/* Page Navigation */}
      {pageCount > 1 && (
        <PageNavigation
          pageIndex={pageIndex}
          pageCount={pageCount}
          onPageChange={onPageChange}
          disabled={isLoading}
        />
      )}

      {/* Low Confidence Page Chips */}
      {lowConfidencePages.length > 0 && (
        <div className="low-confidence-chips">
          <span className="chip-label">Jump to low-confidence pages:</span>
          {lowConfidencePages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePageJump(p)}
              className="chip"
              title={`Go to page ${p + 1}`}
            >
              {p + 1}
            </button>
          ))}
        </div>
      )}

      {/* PDF Canvas Wrapper - position relative for absolute children */}
      <div ref={wrapperRef} className="pdf-canvas-wrapper" style={{ position: "relative", minHeight: "400px" }}>
        
        {/* Canvas container - ALWAYS in DOM */}
        <div style={{ position: "relative" }}>
          {/* Canvas element - ALWAYS mounted */}
          <canvas 
            ref={canvasRef} 
            className="pdf-canvas"
            style={{ 
              display: "block",
              visibility: (isLoading || renderError) ? "hidden" : "visible"
            }}
          />
          
          {/* Drawing overlay - only when ready */}
          {drawingEnabled && !isLoading && !renderError && pageMeta && (
            <DrawingOverlay
              rects={rects}
              draft={draft}
              confirmUI={confirmUI}
              pageMeta={pageMeta}
              activeFileIndex={activeFileIndex}
              handlers={handlers}
              actions={actions}
              disabled={false}
              pdfCanvasRef={canvasRef}
            />
          )}
        </div>

        {/* Loading indicator - shows while canvas is hidden */}
        {isLoading && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <div className="pdf-loading">Loading PDF...</div>
          </div>
        )}
        
        {/* Error message - shows while canvas is hidden */}
        {renderError && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center"
          }}>
            <div className="pdf-error">{renderError}</div>
          </div>
        )}
      </div>

      {/* Tip */}
      {drawingEnabled && !isLoading && !renderError && (
        <p className="pdf-tip">
          Tip: Click and drag on the preview to draw a rectangle. Release to confirm.
        </p>
      )}
    </div>
  );
}