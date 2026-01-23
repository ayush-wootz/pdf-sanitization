import React from "react";

/**
* PageNavigation Component
* Displays page navigation controls (Prev/Next) and current page indicator
*
* @param {Number} pageIndex - Current page index (0-based)
* @param {Number} pageCount - Total number of pages
* @param {Function} onPageChange - Callback when page changes
* @param {Boolean} disabled - Whether navigation is disabled
*/

export default function PageNavigation({ pageIndex, pageCount, onPageChange, disabled = false }) {
    const curentPage = pageIndex + 1;
    const isFirstPage = pageIndex <= 0;
    const isLastPage = pageIndex >= pageCount - 1;

    const handlePrev = () => {
        if (!isFirstPage && !disabled) {
            onPageChange(pageIndex - 1);
        }
    };

    const handleNext = () => {
        if (!isLastPage && !disabled) {
            onPageChange(pageIndex + 1);
        }
    };

    return (
        <div className="page-navigation">
            <button
                type="button"
                onClick={handlePrev}
                disabled={isFirstPage || disabled}
                className="btn btn-nav"
                title="Previous page"
            >
                ← Prev
            </button>

            <span className="page-indicator">
                Page {curentPage} of {pageCount}
            </span>

            <button 
                type="button"
                onClick={handleNext}
                disabled={isLastPage || disabled}
                className="btn btn-nav"
                title="Next page"
            >
                Next →
            </button>
        </div>
    );
}