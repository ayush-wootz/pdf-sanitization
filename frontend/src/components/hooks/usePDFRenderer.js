import { useState, useEffect, useRef } from "react";
import { ensurePDFJs, clampPageIndex, getPageMetadata, calculateFitScale } from "../utils/pdfUtils";

/**
* Custom hook for PDF rendering
* Handles PDF.js integration, page loading, and canvas rendering
* 
* @param {File} file - PDF file to render
* @param {Number} pageIndex - Current page index (0-based)
* @param {Number} renderScale - Scale factor for rendering (default 1)
* @returns {Object} - PDF rendering state and refs
*/

export function usePDFRenderer(file, pageIndex = 0, renderScale = 1) {
    const [pageCount, setPageCount] = useState(1);
    const [pageMeta, setPageMeta] = useState(null);
    const [renderError, setRenderError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const canvasRef = useRef(null);
    const wrapperRef = useRef(null);
    const pdfDocRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        async function renderPage() {
            if (!file || !canvasRef.current) return;

            setIsLoading(true);
            setRenderError("");

            try {
                // Ensure PDF.js is loaded
                await ensurePDFJs();

                // Load PDF document 
                const data = await file.arrayBuffer();
                const loadingTask = window.pdfjsLib.getDocument({ data });
                const pdf = await loadingTask.promise;
                pdfDocRef.current = pdf;

                // Get total pages
                const total = pdf.numPages || pdf._pdfInfo?.numPages || 1;
                setPageCount(total);

                // Clamp page index to valid range
                const validPageIndex = clampPageIndex(pageIndex, total);

                // Get page (PDF.js uses 1-based indexing)
                const page = await pdf.getPage(validPageIndex + 1);

                // Get base viewport (scale 1) for stable coordinates
                const baseViewport = page.getViewport({ scale: 1 });

                // Calculate fit scale to prevent overflow
                const maxWidth = wrapperRef.current
                    ? Math.max(320, wrapperRef.current.clientWidth || 800)
                    : 800;
                const fitScale = calculateFitScale(baseViewport.width, maxWidth, 1);
                const scale = Math.min(renderScale, fitScale);

                // Get scaled viewport
                const viewport = page.getViewport({ scale });

                // Get page metadata
                const metadata = getPageMetadata(page, validPageIndex);
                setPageMeta(metadata);

                // Render to canvas
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                canvas.width = Math.floor(viewport.width);
                canvas.height = Math.floor(viewport.height);

                // Set CSS size to match pixel size for accurate overlay mapping
                canvas.style.width = `${Math.floor(canvas.width)}px`;
                canvas.style.height = `${Math.floor(canvas.height)}px`;

                // Render page
                await page.render({
                    canvasContext: ctx,
                    viewport: viewport,
                }).promise;

                if (cancelled) return;

                setIsLoading(false);
            } catch (err) {
                console.error("PDF render error:", err);
                setRenderError("Failed to render PDF page.");
                setIsLoading(false);
            }
        }

        renderPage();

        return () => {
            cancelled = true;
        };
    }, [file, pageIndex, renderScale]);

    return {
        canvasRef,
        wrapperRef,
        pageCount,
        pageMeta,
        renderError,
        isLoading,
    };
}c