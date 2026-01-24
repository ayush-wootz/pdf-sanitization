import React, { useRef, useEffect } from "react";
import ConfirmCancelUI from "../rectangles/ConfirmCancelUI";
import { denormalizeCoordinates } from "../../utils/pdfUtils";

/**
 * DrawingOverlay Component
 * Transparent canvas overlay for drawing rectangles on top of PDF
 * Handles pointer events and renders rectangles
 * 
 * @param {Array} rects - Array of rectangle objects in PDF coordinates
 * @param {Object} draft - Current draft rectangle in canvas pixels
 * @param {Object} confirmUI - Position for confirm/cancel UI {left, top}
 * @param {Object} pageMeta - Current page metadata {width, height, pageNo}
 * @param {Number} activeFileIndex - Currently active file index
 * @param {Object} handlers - Pointer event handlers
 * @param {Object} actions - Actions (confirmDraft, cancelDraft)
 * @param {Boolean} disabled - Whether drawing is disabled
 * @param {Object} pdfCanvasRef - Ref to the PDF canvas (to get dimensions)
 */
export default function DrawingOverlay({
  rects,
  draft,
  confirmUI,
  pageMeta,
  activeFileIndex,
  handlers,
  actions,
  disabled = false,
  pdfCanvasRef,
}) {
  const overlayRef = useRef(null);

  // Sync overlay dimensions with PDF canvas
  useEffect(() => {
    if (!pdfCanvasRef?.current || !overlayRef.current) return;
    
    const pdfCanvas = pdfCanvasRef.current;
    const overlay = overlayRef.current;
    
    // Match dimensions
    overlay.width = pdfCanvas.width;
    overlay.height = pdfCanvas.height;
    overlay.style.width = `${pdfCanvas.width}px`;
    overlay.style.height = `${pdfCanvas.height}px`;
  }, [pdfCanvasRef, pageMeta]); // Re-sync when page changes

  // Draw rectangles and draft on overlay
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    
    const ctx = overlay.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // Draw confirmed rectangles
    if (pageMeta && rects.length > 0 && overlay.width > 0 && overlay.height > 0) {
      const canvasWidth = overlay.width;
      const canvasHeight = overlay.height;

      rects
        .filter((r) => r.fileIdx === activeFileIndex && (r.page ?? 0) === (pageMeta.pageNo ?? 0))
        .forEach((r) => {
          // Convert from PDF coordinates to canvas pixels
          const canvasRect = denormalizeCoordinates(
            r,
            pageMeta.width,
            pageMeta.height,
            canvasWidth,
            canvasHeight
          );

          ctx.strokeStyle = "rgba(255, 0, 0, 0.9)";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.strokeRect(canvasRect.x, canvasRect.y, canvasRect.w, canvasRect.h);
          ctx.setLineDash([]);
        });
    }

    // Draw draft rectangle
    if (draft && draft.w > 0 && draft.h > 0) {
      ctx.strokeStyle = "rgba(0, 200, 255, 0.9)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(draft.x, draft.y, draft.w, draft.h);
      ctx.setLineDash([]);
    }
  }, [rects, draft, pageMeta, activeFileIndex, pdfCanvasRef]);

  // Pointer event handlers
  const handlePointerDown = (e) => {
    if (disabled) return;
    handlers.onPointerDown(e, overlayRef);
  };

  const handlePointerMove = (e) => {
    if (disabled) return;
    handlers.onPointerMove(e, overlayRef);
  };

  const handlePointerUp = (e) => {
    if (disabled) return;
    handlers.onPointerUp(e, overlayRef);
  };

  const handleConfirm = () => {
    actions.confirmDraft(overlayRef);
  };

  const handleCancel = () => {
    actions.cancelDraft();
  };

  return (
    <>
      <canvas
        ref={overlayRef}
        className="drawing-overlay"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          cursor: disabled ? "default" : "crosshair",
          touchAction: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* Confirm/Cancel UI */}
      {confirmUI && draft && !disabled && (
        <ConfirmCancelUI position={confirmUI} onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </>
  );
}