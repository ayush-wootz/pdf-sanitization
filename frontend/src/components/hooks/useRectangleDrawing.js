import { useState, useRef, useCallback, use } from "react";

/**
* Custom hook for rectangle drawing on canvas
* Handles pointer events, draft state, and rectangle management
* 
* @param {Object} pageMeta - Current page metadata {pageNo, width, height}
* @param {Number} activeFileIndex - Current active file index
* @returns {Object} - Drawing state, handlers, and actions
*/

export function useRectangleDrawing(pageMeta, activeFileIndex) {
    const [rects, setRects] = useState([]);
    const [draft, setDraft] = useState(null);
    const [confirmUI, setConfirmUI] = useState(null);

    const startRef = useRef(null);
    const drawingRef = useRef(false);

    // Handle pointer down event - start drawing
    const onPointerDown = useCallback((e, overlayRef) => {
        if (!overlayRef?.current) return;

        e.preventDefault();
        overlayRef.current.setPointerCapture?.(e.pointerId);

        const rect = overlayRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        startRef.current = { x, y };
        drawingRef.current = true;
        setDraft({ x, y, w: 0, h: 0 });
        setConfirmUI(null);
    }, []);

    // Handle pointer move event - update draft rectangle
    const onPointerMove = useCallback((e, overlayRef) => {
        if (!drawingRef.current || !overlayRef?.current || !startRef.current) return;

        e.preventDefault();
        const rect = overlayRef.current.getBoundingClientRect();
        const x2 = e.clientX - rect.left;
        const y2 = e.clientY - rect.top;   

        const x = Math.min(startRef.current.x, x2);
        const y = Math.min(startRef.current.y, y2);
        const w = Math.abs(x2 - startRef.current.x);
        const h = Math.abs(y2 - startRef.current.y);

        setDraft({ x, y, w, h });
    }, []);

    // Handle pointer up event - finalize rectangle
    const onPointerUp = useCallback((e, overlayRef) => {
        if (!drawingRef.current) return;

        e.preventDefault();
        drawingRef.current = false;
        overlayRef?.current?.releasePointerCapture?.(e.pointerId);

        // Ignore tiny rectangles
        if (!draft || draft.w < 4 || draft.h < 4) {
            setDraft(null);
            setConfirmUI(null);
            return;
        }

        // Calculate confirm UI position (clamped to stay in view)
        const overlay = overlayRef?.current;
        if (!overlay) return;

        const pad = 8;
        const approxW = 220;
        const approxH = 44;
        let left = draft.x + draft.w + pad;
        let top = draft.y + draft.h + pad;

        const cw = overlay.clientWidth || 0;
        const ch = overlay.clientHeight || 0;
        left = Math.max(pad, Math.min(left, cw - approxW - pad));
        top = Math.max(pad, Math.min(top, ch - approxH - pad));

        setConfirmUI({ left, top });
    }, [draft]);

    // Confirm draft rectangle and add to list
    const confirmDraft = useCallback((overlayRef) => {
        if (!draft || !pageMeta) return;

        const id = String(Date.now()) + "-" + Math.random().toString(36).slice(2);

        // Store coordinates in base (scale = 1) PDF units
        const canvasWidth = overlayRef.current.width;
        const canvasHeight = overlayRef.current.height;
        const scaleX = canvasWidth && pageMeta.width ? pageMeta.width / canvasWidth : 1;
        const scaleY = canvasHeight && pageMeta.height ? pageMeta.height / canvasHeight : 1;

        const newRect = {
            id, 
            x: Math.round(draft.x * scaleX),
            y: Math.round(draft.y * scaleY),
            w: Math.round(draft.w * scaleX),
            h: Math.round(draft.h * scaleY),
            fileIdx: activeFileIndex,
            page: pageMeta.pageNo ?? 0,
            paper: pageMeta.sizeClass ?? "A4",
            orientation: pageMeta.orientation ?? "H",
        };

        setReacts((prev) => [...prev, newRect]);
        setDraft(null);
        setConfirmUI(null);
    }, [draft, pageMeta, activeFileIndex]);

    // Cancel draft rectangle
    const cancelDraft = useCallback(() => {
        setDraft(null);
        setConfirmUI(null);
    }, []);

    // Remove rectangle by ID
    const removeRect = useCallback((id) => {
        setRects((prev) => prev.filter((r) => r.id !== id));
    }, []);

    // Clear all rectangles
    const clearRects = useCallback(() => {
        setRects([]);
    }, []);

    // Set rectangles (for loading existing)
    const setRectsDirectly = useCallback((newRects) => {
        setRects(newRects);
    }, []);

    return {
        // State
        rects,
        draft,
        confirmUI,

        // Handlers
        handlers: {
            onPointerDown,
            onPointerMove,
            onPointerUp,
        },

        // Actions
        actions: {
            confirmDraft,
            cancelDraft,
            removeRect,
            clearRects,
            setRects: setRectsDirectly,
        },
    };
}