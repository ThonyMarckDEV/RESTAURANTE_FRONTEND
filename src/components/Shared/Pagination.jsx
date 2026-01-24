import React from 'react';

const DOTS = '...';

const getPaginationRange = ({ totalPages, currentPage, siblingCount = 1 }) => {
  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const totalPageNumbers = siblingCount + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = range(totalPages - rightItemCount + 1, totalPages);
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

  return range(1, totalPages);
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const paginationRange = getPaginationRange({ currentPage, totalPages });

  // Si no hay páginas o solo hay una, no renderizamos nada
  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <nav className="flex justify-center items-center space-x-1 mt-8 select-none">
      {/* Botón Anterior */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Anterior
      </button>

      {/* Números de Página */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">
              &#8230;
            </span>
          );
        }

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`px-4 py-2 text-sm font-semibold border transition-all ${
              currentPage === pageNumber
                ? 'bg-red-700 text-white border-red-700 z-10 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      {/* Botón Siguiente */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
      </button>
    </nav>
  );
};

export default Pagination;