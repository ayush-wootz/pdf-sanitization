import { useState, useEffect, useRef } from "react";
import { ensurePDFJs, clampPageIndex, getPageMetadata, calculateFitScale } from "../utils/pdfUtils";

/**
 * Custom hook for PDF rendering - DEBUG VERSION
 * Includes extensive console logging to help debug issues
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
      console.log("🎬 [PDF Render] Starting render...");
      console.log("  → File:", file?.name || "NO FILE");
      console.log("  → Page index:", pageIndex);
      console.log("  → Canvas ref exists:", !!canvasRef.current);
      
      // Early exit if no file
      if (!file) {
        console.log("❌ [PDF Render] No file provided, exiting");
        setIsLoading(false);
        return;
      }

      // Wait for canvas to be ready
      if (!canvasRef.current) {
        console.log("⏳ [PDF Render] Canvas not ready yet, exiting");
        setIsLoading(false);
        return;
      }

      console.log("✅ [PDF Render] Canvas is ready");
      setIsLoading(true);
      setRenderError("");

      try {
        // Ensure PDF.js is loaded
        console.log("📚 [PDF Render] Loading PDF.js...");
        await ensurePDFJs();
        console.log("✅ [PDF Render] PDF.js loaded");

        // Check if PDF.js is available
        if (!window.pdfjsLib) {
          throw new Error("PDF.js (window.pdfjsLib) is not available!");
        }
        console.log("✅ [PDF Render] window.pdfjsLib exists");

        // Load PDF document
        console.log("📄 [PDF Render] Loading PDF document...");
        const data = await file.arrayBuffer();
        console.log("✅ [PDF Render] File read as ArrayBuffer, size:", data.byteLength);
        
        const loadingTask = window.pdfjsLib.getDocument({ data });
        const pdf = await loadingTask.promise;
        
        if (cancelled) {
          console.log("🚫 [PDF Render] Cancelled after loading PDF");
          return;
        }
        
        console.log("✅ [PDF Render] PDF document loaded");
        pdfDocRef.current = pdf;

        // Get total pages
        const total = pdf.numPages || pdf._pdfInfo?.numPages || 1;
        console.log("📊 [PDF Render] Total pages:", total);
        setPageCount(total);

        // Clamp page index to valid range
        const validPageIndex = clampPageIndex(pageIndex, total);
        console.log("📄 [PDF Render] Rendering page:", validPageIndex + 1, "of", total);

        // Get page (PDF.js uses 1-based indexing)
        const page = await pdf.getPage(validPageIndex + 1);
        console.log("✅ [PDF Render] Page object loaded");
        
        if (cancelled) {
          console.log("🚫 [PDF Render] Cancelled after loading page");
          return;
        }

        // Get base viewport (scale 1) for stable coordinates
        const baseViewport = page.getViewport({ scale: 1 });
        console.log("📐 [PDF Render] Base viewport:", 
          "width:", Math.floor(baseViewport.width), 
          "height:", Math.floor(baseViewport.height)
        );

        // Calculate fit scale to prevent overflow
        const maxWidth = wrapperRef.current
          ? Math.max(320, wrapperRef.current.clientWidth || 800)
          : 800;
        const fitScale = calculateFitScale(baseViewport.width, maxWidth, 1);
        const scale = Math.min(renderScale, fitScale);
        console.log("🔍 [PDF Render] Scale:", scale);

        // Get scaled viewport
        const viewport = page.getViewport({ scale });
        console.log("📐 [PDF Render] Scaled viewport:", 
          "width:", Math.floor(viewport.width), 
          "height:", Math.floor(viewport.height)
        );

        // Get page metadata (in base scale coordinates)
        const metadata = getPageMetadata(page, validPageIndex);
        console.log("📋 [PDF Render] Page metadata:", metadata);
        
        if (cancelled) {
          console.log("🚫 [PDF Render] Cancelled before render");
          return;
        }
        
        setPageMeta(metadata);

        // Double-check canvas is still available
        const canvas = canvasRef.current;
        if (!canvas) {
          console.log("❌ [PDF Render] Canvas disappeared!");
          setIsLoading(false);
          return;
        }

        console.log("🎨 [PDF Render] Getting canvas context...");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("❌ [PDF Render] Failed to get canvas context!");
          setRenderError("Failed to get canvas context");
          setIsLoading(false);
          return;
        }
        console.log("✅ [PDF Render] Canvas context obtained");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        
        console.log("📏 [PDF Render] Canvas sized to:", canvas.width, "x", canvas.height);

        // Render page
        console.log("🖼️ [PDF Render] Starting page render...");
        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;

        if (cancelled) {
          console.log("🚫 [PDF Render] Cancelled after render");
          return;
        }

        console.log("🎉 [PDF Render] SUCCESS! PDF rendered to canvas");
        setIsLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error("💥 [PDF Render] ERROR:", err);
        console.error("  → Error name:", err.name);
        console.error("  → Error message:", err.message);
        console.error("  → Stack:", err.stack);
        setRenderError("Failed to render PDF page: " + err.message);
        setIsLoading(false);
      }
    }

    renderPage();

    return () => {
      console.log("🧹 [PDF Render] Cleanup (unmounting)");
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
}