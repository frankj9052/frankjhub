import { useState, useMemo } from 'react';

export interface UsePaginationProps {
  totalItems: number;
  pageSize?: number;
  currentPage?: number;
  maxPagesToShow?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pages: number[];
  isFirstPage: boolean;
  isLastPage: boolean;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
}

/**
 * Custom hook for pagination logic in a React component.
 *
 * @param {Object} props - The properties for pagination.
 * @param {number} props.totalItems - The total number of items to paginate.
 * @param {number} [props.pageSize=10] - The number of items per page.
 * @param {number} [props.currentPage=1] - The initial current page.
 * @param {number} [props.maxPagesToShow=5] - The maximum number of pagination buttons to display.
 *
 * @returns {Object} An object containing pagination state and functions:
 * @returns {number} currentPage - The current active page number.
 * @returns {number} totalPages - The total number of pages.
 * @returns {number} pageSize - The number of items per page.
 * @returns {number[]} pages - The array of page numbers to be displayed.
 * @returns {boolean} isFirstPage - Boolean indicating if the current page is the first page.
 * @returns {boolean} isLastPage - Boolean indicating if the current page is the last page.
 * @returns {function} goToPage - Function to navigate to a specific page.
 * @returns {function} goToNextPage - Function to navigate to the next page.
 * @returns {function} goToPreviousPage - Function to navigate to the previous page.
 * @returns {function} setPageSize - Function to set a new page size and adjust pagination accordingly.
 */

export const usePagination = ({
  totalItems: initialTotalItems = 0,
  pageSize: initialPageSize = 10,
  currentPage: initialCurrentPage = 1,
  maxPagesToShow = 5,
}: UsePaginationProps): UsePaginationReturn => {
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  // 计算要显示的分页按钮
  const pages = useMemo(() => {
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfMaxPages);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // 如果当前页接近末尾，调整起始页
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages, maxPagesToShow]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      goToPage(currentPage - 1);
    }
  };

  const handleSetPageSize = (size: number) => {
    const newPageSize = Math.max(1, size);
    setPageSize(newPageSize);

    // 重新计算当前页，确保不超过新的总页数
    const newTotalPages = Math.ceil(totalItems / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  const handleSetTotalItems = (total: number) => {
    const newTotalItems = Math.max(0, total);
    setTotalItems(newTotalItems);

    // Recalculate current page to ensure it doesn't exceed new total pages
    const newTotalPages = Math.ceil(newTotalItems / pageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    pages,
    isFirstPage,
    isLastPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setPageSize: handleSetPageSize,
    setTotalItems: handleSetTotalItems,
  };
};

export default usePagination;
