// PDF Utilities - Helper functions for PDf.js integration and PDF processing

// global pdfjsLib
let pdfjsReady = false;

// Dynamically load PDF.js from CDN, ensures PDF.js is available before rendering
export async function ensurePDFJs() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (pdfjsReady) return;

    // Load main PDF.js library
    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    // Load PDF.js worker
    await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    })

    // Configure worker
    if (window.pdfjsLib?.GlobalWorkerOptions) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }

    pdfjsReady = true;
}

/**
* Classify page size into standard paper sizes
* @param {Number} width - Page width in PDF points
* @param {Number} height - Page height in PDF points
* @returns {String} - Size classification (A1, A2, A3, A4)
*/

export function classifyPageSize(width, height) {
    const maxDim = Math.max(width, height);
    if (maxDim > 2000) return "A1";
    if (maxDim > 1500) return "A2";
    if (maxDim > 1000) return "A3";
    return "A4";
}

/**
* Determine page orientation
* @param {Number} width - Page width
* @param {Number} height - Page height
* @returns {String} - "H" for horizontal, "V" for vertical
*/

export function getPageOrientation(width, height) {
    return width >= height ? "H" : "V";
}

/**
* Calculate scale to fit PDF into container
* @param {Number} pdfWidth - PDF page width
* @param {Number} containerWidth - Container width in pixels
* @param {Number} maxScale - Maximum scale allowed (default 1)
* @returns {Number} - Scale factor
*/

export function calculateFitScale(pdfWidth, containerWidth, maxScale = 1) {
    if (!containerWidth || containerWidth <= 0) return 1;
    const fitScale = containerWidth / pdfWidth;
    return Math.min(fitScale, maxScale);
}

/**
* Normalize rectangle coordinates from canvas to PDF space
* @param {Object} rect - Rectangle in canvas pixels {x, y, w, h}
* @param {Number} canvasWidth - Canvas width in pixels
* @param {Number} canvasHeight - Canvas height in pixels
* @param {Number} pdfWidth - PDF page width in points
* @param {Number} pdfHeight - PDF page height in points
* @returns {Object} - Normalized rectangle {x, y, w, h} in PDF points
*/

export function normalizeCoordinates(rect, canvasWidth, canvasHeight, pdfWidth, pdfHeight) {
    const scaleX = pdfWidth / canvasWidth;
    const scaleY = pdfHeight / canvasHeight;
    return {
        x: Math.round(rect.x * scaleX),
        y: Math.round(rect.y * scaleY),
        w: Math.round(rect.w * scaleX),
        h: Math.round(rect.h * scaleY),
    };
}

/**
* Denormalize rectangle coordinates from PDF space to canvas
* @param {Object} rect - Rectangle in PDF points {x, y, w, h}
* @param {Number} pdfWidth - PDF page width in points
* @param {Number} pdfHeight - PDF page height in points
* @param {Number} canvasWidth - Canvas width in pixels
* @param {Number} canvasHeight - Canvas height in pixels
* @returns {Object} - Canvas rectangle {x, y, w, h} in pixels
*/

export function denormalizeCoordinates(rect, pdfWidth, pdfHeight, canvasWidth, canvasHeight) {
    const scaleX = canvasWidth / pdfWidth;
    const scaleY = canvasHeight / pdfHeight;
    return {
        x: Math.round(rect.x * scaleX),
        y: Math.round(rect.y * scaleY),
        w: Math.round(rect.w * scaleX),
        h: Math.round(rect.h * scaleY),
    };
}

/**
* Clamp page index to valid range
* @param {Number} index - Page index (0-based)
* @param {Number} totalPages - Total number of pages
* @returns {Number} - Clamped page index
*/

export function clampPageIndex(index, totalPages) {
    return Math.min(Math.max(0, index), totalPages - 1);
}

/**
* Get page metadata from PDF page object
* @param {Object} page - PDF.js page object
* @param {Number} pageIndex - 0-based page index
* @returns {Object} - Page metadata
*/

export function getPageMetadata(page, pageIndex) {
    const viewport = page.getViewport({ scale: 1 });
    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);

    return {
        pageNo: pageIndex,
        width,
        height,
        sizeClass: classifyPageSize(width, height),
        orientation: getPageOrientation(width, height),
    };
}